"""
Serviço para rastreamento de progresso de processamento OCR
"""

import threading
from typing import Dict, Optional
from datetime import datetime


class ProgressTracker:
    """
    Classe para rastrear progresso de processamento em tempo real
    """
    
    def __init__(self):
        self._progress_data: Dict[str, Dict] = {}
        self._lock = threading.Lock()
    
    def start_progress(self, task_id: str, total_pages: int = 0) -> None:
        """
        Inicia rastreamento de progresso para uma tarefa
        
        Args:
            task_id: ID único da tarefa
            total_pages: Total de páginas a processar
        """
        with self._lock:
            self._progress_data[task_id] = {
                'current_page': 0,
                'total_pages': total_pages,
                'status': 'iniciando',
                'start_time': datetime.now(),
                'last_update': datetime.now(),
                'message': 'Iniciando processamento...'
            }
    
    def update_progress(self, task_id: str, current_page: int, message: str = None) -> None:
        """
        Atualiza progresso de uma tarefa
        
        Args:
            task_id: ID da tarefa
            current_page: Página atual sendo processada
            message: Mensagem de status opcional
        """
        with self._lock:
            if task_id in self._progress_data:
                self._progress_data[task_id]['current_page'] = current_page
                self._progress_data[task_id]['last_update'] = datetime.now()
                self._progress_data[task_id]['status'] = 'processando'
                
                if message:
                    self._progress_data[task_id]['message'] = message
                else:
                    total = self._progress_data[task_id]['total_pages']
                    self._progress_data[task_id]['message'] = f'Processando página {current_page}/{total}...'
    
    def set_total_pages(self, task_id: str, total_pages: int) -> None:
        """
        Define o total de páginas após descobrir durante o processamento
        
        Args:
            task_id: ID da tarefa
            total_pages: Total de páginas descoberto
        """
        with self._lock:
            if task_id in self._progress_data:
                self._progress_data[task_id]['total_pages'] = total_pages
    
    def complete_progress(self, task_id: str, success: bool = True, message: str = None) -> None:
        """
        Marca progresso como completo
        
        Args:
            task_id: ID da tarefa
            success: Se completou com sucesso
            message: Mensagem final opcional
        """
        with self._lock:
            if task_id in self._progress_data:
                self._progress_data[task_id]['status'] = 'concluido' if success else 'erro'
                self._progress_data[task_id]['last_update'] = datetime.now()
                
                if message:
                    self._progress_data[task_id]['message'] = message
                elif success:
                    total = self._progress_data[task_id]['total_pages']
                    self._progress_data[task_id]['message'] = f'Processamento concluído! {total} páginas processadas.'
    
    def get_progress(self, task_id: str) -> Optional[Dict]:
        """
        Obtém progresso atual de uma tarefa
        
        Args:
            task_id: ID da tarefa
            
        Returns:
            Dados de progresso ou None se não encontrado
        """
        with self._lock:
            if task_id in self._progress_data:
                progress = self._progress_data[task_id].copy()
                
                # Calcula porcentagem
                if progress['total_pages'] > 0:
                    progress['percentage'] = (progress['current_page'] / progress['total_pages']) * 100
                else:
                    progress['percentage'] = 0
                
                # Calcula tempo decorrido
                elapsed = datetime.now() - progress['start_time']
                progress['elapsed_seconds'] = elapsed.total_seconds()
                
                return progress
            
            return None
    
    def cleanup_progress(self, task_id: str) -> None:
        """
        Remove dados de progresso de uma tarefa concluída
        
        Args:
            task_id: ID da tarefa
        """
        with self._lock:
            if task_id in self._progress_data:
                del self._progress_data[task_id]
    
    def cleanup_old_progress(self, max_age_hours: int = 1) -> None:
        """
        Remove dados de progresso antigos
        
        Args:
            max_age_hours: Idade máxima em horas para manter dados
        """
        with self._lock:
            current_time = datetime.now()
            expired_tasks = []
            
            for task_id, data in self._progress_data.items():
                elapsed = current_time - data['last_update']
                if elapsed.total_seconds() > (max_age_hours * 3600):
                    expired_tasks.append(task_id)
            
            for task_id in expired_tasks:
                del self._progress_data[task_id]


# Instância global do rastreador de progresso
progress_tracker = ProgressTracker()