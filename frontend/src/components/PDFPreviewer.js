import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { Box, Typography, Button } from '@mui/material';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

const PDFPreviewer = ({ file, onExtractWithMargins }) => {
  const [margins, setMargins] = useState({ top: 10, bottom: 10, left: 5, right: 5 });
  const [dragging, setDragging] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [pageRect, setPageRect] = useState(null);
  const [viewerReady, setViewerReady] = useState(false);
  const viewerRef = useRef(null);
  const overlayRef = useRef(null);

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel, GoToNextPage, GoToPreviousPage, NumberOfPages, layout } = pageNavigationPluginInstance;

  useEffect(() => {
    if (file) {
      console.log('[PDFPreviewer] Novo arquivo recebido:', file);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setViewerReady(false);
      setPageRect(null);
      return () => {
        console.log('[PDFPreviewer] Revogando URL do arquivo');
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  // Função melhorada para encontrar a página do PDF
  const findPageElement = useCallback(() => {
    if (!viewerRef.current) return null;

    // Múltiplos seletores possíveis
    const selectors = [
      '.rpv-core__page-layer',
      '.rpv-core__canvas-layer canvas',
      '.rpv-page-layer',
      '[data-testid="core__page-layer-0"]',
      '.pdfViewer .page canvas',
      'canvas[data-page-number="1"]'
    ];

    for (const selector of selectors) {
      const element = viewerRef.current.querySelector(selector);
      if (element) {
        console.log(`[PDFPreviewer] Elemento encontrado com seletor: ${selector}`, element);
        return element;
      }
    }

    // Fallback: procurar qualquer canvas
    const canvas = viewerRef.current.querySelector('canvas');
    if (canvas) {
      console.log('[PDFPreviewer] Canvas encontrado como fallback:', canvas);
      return canvas;
    }

    console.warn('[PDFPreviewer] Nenhum elemento de página encontrado');
    return null;
  }, []);

  // Função melhorada para calcular o pageRect
  const updatePageRect = useCallback(() => {
    const pageElement = findPageElement();
    if (pageElement && viewerRef.current) {
      const rect = pageElement.getBoundingClientRect();
      const containerRect = viewerRef.current.getBoundingClientRect();
      
      // Calcular posição relativa ao container
      const relativeRect = {
        top: rect.top - containerRect.top + viewerRef.current.scrollTop,
        left: rect.left - containerRect.left + viewerRef.current.scrollLeft,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom - containerRect.top + viewerRef.current.scrollTop,
        right: rect.right - containerRect.left + viewerRef.current.scrollLeft
      };

      setPageRect(relativeRect);
      console.log('[PDFPreviewer] pageRect atualizado:', relativeRect);
      
      // IMPORTANTE: Definir viewerReady como true quando pageRect for encontrado
      if (!viewerReady) {
        setViewerReady(true);
        console.log('[PDFPreviewer] Viewer marcado como pronto!');
      }
      
      return true;
    }
    return false;
  }, [findPageElement, viewerReady]);

  // Observer para mudanças no DOM - MELHORADO
  useEffect(() => {
    if (!viewerRef.current || !fileUrl) return;

    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Verificar se foi adicionado um canvas ou página
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'CANVAS' || 
                  node.classList?.contains('rpv-core__page-layer') ||
                  node.querySelector?.('canvas') ||
                  node.querySelector?.('.rpv-core__page-layer')) {
                shouldUpdate = true;
                console.log('[PDFPreviewer] DOM mudou, atualizando pageRect');
                break;
              }
            }
          }
        }
      });

      if (shouldUpdate) {
        setTimeout(() => {
          updatePageRect();
        }, 100);
      }
    });

    observer.observe(viewerRef.current, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [fileUrl, updatePageRect]);

  // Polling como fallback se o observer não funcionar
  useEffect(() => {
    if (!fileUrl || viewerReady) return;

    const pollInterval = setInterval(() => {
      console.log('[PDFPreviewer] Polling para detectar página...');
      if (updatePageRect()) {
        clearInterval(pollInterval);
      }
    }, 500);

    // Limpar após 10 segundos
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      console.warn('[PDFPreviewer] Timeout atingido, parando polling');
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [fileUrl, viewerReady, updatePageRect]);

  // Listener para scroll e resize
  useEffect(() => {
    const handleScrollResize = () => {
      if (pageRect && viewerReady) {
        updatePageRect();
      }
    };

    const container = viewerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScrollResize);
      window.addEventListener('resize', handleScrollResize);
      
      return () => {
        container.removeEventListener('scroll', handleScrollResize);
        window.removeEventListener('resize', handleScrollResize);
      };
    }
  }, [pageRect, viewerReady, updatePageRect]);

  // REMOVER dependência do onPageLayerRender - não está funcionando
  const handleDocumentLoad = useCallback((e) => {
    console.log('[PDFPreviewer] onDocumentLoad chamado', e);
    setTimeout(() => {
      updatePageRect();
    }, 500);
  }, [updatePageRect]);

  // Handlers de mouse melhorados
  const handleMouseMove = useCallback((e) => {
    if (!dragging || !pageRect) return;

    e.preventDefault();
    e.stopPropagation();

    // Calcular posição relativa à página
    const rect = pageRect;
    let newMarginPct;

    // Obter posição do mouse relativa ao container
    const containerRect = viewerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left + viewerRef.current.scrollLeft;
    const mouseY = e.clientY - containerRect.top + viewerRef.current.scrollTop;

    switch (dragging) {
      case 'top':
        newMarginPct = Math.max(0, Math.min(90, ((mouseY - rect.top) / rect.height) * 100));
        if (newMarginPct < 100 - margins.bottom) {
          setMargins(m => ({ ...m, top: newMarginPct }));
        }
        break;
      case 'bottom':
        newMarginPct = Math.max(0, Math.min(90, ((rect.bottom - mouseY) / rect.height) * 100));
        if (newMarginPct < 100 - margins.top) {
          setMargins(m => ({ ...m, bottom: newMarginPct }));
        }
        break;
      case 'left':
        newMarginPct = Math.max(0, Math.min(90, ((mouseX - rect.left) / rect.width) * 100));
        if (newMarginPct < 100 - margins.right) {
          setMargins(m => ({ ...m, left: newMarginPct }));
        }
        break;
      case 'right':
        newMarginPct = Math.max(0, Math.min(90, ((rect.right - mouseX) / rect.width) * 100));
        if (newMarginPct < 100 - margins.left) {
          setMargins(m => ({ ...m, right: newMarginPct }));
        }
        break;
      default: 
        break;
    }
  }, [dragging, margins, pageRect]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const renderOverlay = () => {
    // MUDANÇA CHAVE: Remover dependência de viewerReady
    if (!pageRect) {
      console.warn('[PDFPreviewer] Overlay não renderizado - pageRect ausente:', { pageRect });
      return null;
    }

    const overlayStyle = {
      position: 'absolute',
      top: `${pageRect.top}px`,
      left: `${pageRect.left}px`,
      width: `${pageRect.width}px`,
      height: `${pageRect.height}px`,
      zIndex: 1000,
      pointerEvents: 'none',
    };

    console.log('[PDFPreviewer] Renderizando overlay:', { overlayStyle, margins });

    return (
      <div ref={overlayRef} style={overlayStyle}>
        {/* Áreas sombreadas */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: `${margins.top}%`, 
          backgroundColor: 'rgba(255, 0, 0, 0.2)', 
          pointerEvents: 'none',
          border: '1px dashed red'
        }} />
        
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          height: `${margins.bottom}%`, 
          backgroundColor: 'rgba(255, 0, 0, 0.2)', 
          pointerEvents: 'none',
          border: '1px dashed red'
        }} />
        
        <div style={{ 
          position: 'absolute', 
          top: `${margins.top}%`, 
          left: 0, 
          width: `${margins.left}%`, 
          height: `calc(100% - ${margins.top}% - ${margins.bottom}%)`, 
          backgroundColor: 'rgba(255, 0, 0, 0.2)', 
          pointerEvents: 'none',
          border: '1px dashed red'
        }} />
        
        <div style={{ 
          position: 'absolute', 
          top: `${margins.top}%`, 
          right: 0, 
          width: `${margins.right}%`, 
          height: `calc(100% - ${margins.top}% - ${margins.bottom}%)`, 
          backgroundColor: 'rgba(255, 0, 0, 0.2)', 
          pointerEvents: 'none',
          border: '1px dashed red'
        }} />

        {/* Réguas arrastáveis - com pointerEvents habilitado */}
        <div 
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging('top');
          }}
          style={{ 
            position: 'absolute', 
            top: `${margins.top}%`, 
            transform: 'translateY(-3px)', 
            left: 0, 
            width: '100%', 
            height: '6px', 
            backgroundColor: 'rgba(0, 123, 255, 0.8)', 
            cursor: 'row-resize',
            pointerEvents: 'all',
            zIndex: 1001,
            border: '1px solid #007bff'
          }} 
        />
        
        <div 
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging('bottom');
          }}
          style={{ 
            position: 'absolute', 
            bottom: `${margins.bottom}%`, 
            transform: 'translateY(3px)', 
            left: 0, 
            width: '100%', 
            height: '6px', 
            backgroundColor: 'rgba(0, 123, 255, 0.8)', 
            cursor: 'row-resize',
            pointerEvents: 'all',
            zIndex: 1001,
            border: '1px solid #007bff'
          }} 
        />
        
        <div 
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging('left');
          }}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: `${margins.left}%`, 
            transform: 'translateX(-3px)', 
            width: '6px', 
            height: '100%', 
            backgroundColor: 'rgba(0, 123, 255, 0.8)', 
            cursor: 'col-resize',
            pointerEvents: 'all',
            zIndex: 1001,
            border: '1px solid #007bff'
          }} 
        />
        
        <div 
          onMouseDown={(e) => {
            e.stopPropagation();
            setDragging('right');
          }}
          style={{ 
            position: 'absolute', 
            top: 0, 
            right: `${margins.right}%`, 
            transform: 'translateX(3px)', 
            width: '6px', 
            height: '100%', 
            backgroundColor: 'rgba(0, 123, 255, 0.8)', 
            cursor: 'col-resize',
            pointerEvents: 'all',
            zIndex: 1001,
            border: '1px solid #007bff'
          }} 
        />
      </div>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Arraste as réguas azuis para definir a área de leitura do documento.
        {!pageRect && (
          <span style={{ color: 'orange' }}> (Aguardando detecção da página...)</span>
        )}
        {pageRect && (
          <span style={{ color: 'green' }}> ✓ Réguas disponíveis!</span>
        )}
      </Typography>
      
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
        <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', height: '70vh' }}>
          <Box sx={{ 
            alignItems: 'center', 
            backgroundColor: '#eeeeee', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)', 
            display: 'flex', 
            justifyContent: 'center', 
            p: '4px' 
          }}>
            <GoToPreviousPage />
            <CurrentPageLabel /> / <NumberOfPages />
            <GoToNextPage />
          </Box>
          
          <Box 
            ref={viewerRef} 
            sx={{ 
              position: 'relative', 
              flex: 1, 
              overflow: 'auto',
              backgroundColor: '#f5f5f5'
            }}
          >
            {fileUrl && (
              <Viewer 
                fileUrl={fileUrl} 
                plugins={[pageNavigationPluginInstance]} 
                layout={layout}
                onDocumentLoad={handleDocumentLoad}
                defaultScale={SpecialZoomLevel.PageFit}
              />
            )}
            {renderOverlay()}
          </Box>
        </Box>
      </Worker>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption">
          Status: {!fileUrl ? 'Sem arquivo' : !pageRect ? 'Detectando página...' : 'Réguas ativas'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => onExtractWithMargins(margins)}
          disabled={!pageRect}
        >
          Extrair Texto (Aplicar a Todas as Páginas)
        </Button>
      </Box>
    </Box>
  );
};

export default PDFPreviewer;