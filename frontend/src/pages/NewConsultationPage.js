// src/pages/NewConsultationPage.js
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Container, Typography, Box, Paper, Button, TextareaAutosize, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function NewConsultationPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioURL, setAudioURL] = useState('');
    const [isUploading, setIsUploading] = useState(false); // Novo estado para o upload

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

// Dentro de src/pages/NewConsultationPage.js

    const uploadAudio = async (audioBlob) => {
        setIsUploading(true);
        setTranscript("Enviando áudio para processamento...");

        const formData = new FormData();
        formData.append('audio_file', audioBlob, `consulta_cliente_${clientId}.wav`);
        formData.append('cliente', clientId);

        try {
            // A resposta desta chamada agora conterá a transcrição
            const response = await axiosInstance.post('/api/consultas/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 segundos de timeout
            });

            console.log("Upload e transcrição bem-sucedidos:", response.data);
            setIsUploading(false);

            // --- A MUDANÇA ESTÁ AQUI ---
            // Atualiza o estado da transcrição com o texto vindo da API
            setTranscript(response.data.transcricao);

        } catch (error) {
            console.error("Erro no upload do áudio:", error);
            setIsUploading(false);
            setTranscript("Ocorreu um erro ao enviar ou transcrever o áudio. Tente novamente.");
            alert("Erro no upload ou transcrição. Verifique o console.");
        }
    };
    
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                
                // Chamar a função de upload quando a gravação parar
                uploadAudio(audioBlob); 
            };
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setAudioURL('');
            setTranscript('');

        } catch (error) {
            console.error("Erro ao iniciar a gravação:", error);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                        Voltar
                    </Button>
                    <Typography variant="h4" component="h1">Nova Consulta / Gravação</Typography>
                </Box>
                <Typography variant="h6" component="h2" gutterBottom color="text.secondary">Cliente ID: {clientId}</Typography>
                
                <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {!isRecording ? (
                        <Button variant="contained" color="primary" size="large" startIcon={<MicIcon />} onClick={handleStartRecording} disabled={isUploading}>
                            Iniciar Gravação
                        </Button>
                    ) : (
                        <Button variant="contained" color="error" size="large" startIcon={<StopCircleIcon />} onClick={handleStopRecording}>
                            Parar Gravação
                        </Button>
                    )}
                    {isRecording && <Typography>Gravando...</Typography>}
                </Box>

                {audioURL && !isUploading && (
                    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1">Áudio Gravado:</Typography>
                        <audio src={audioURL} controls />
                    </Box>
                )}

                <Typography variant="h5" gutterBottom>Transcrição</Typography>
                {isUploading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Enviando e processando...</Typography>
                    </Box>
                )}
                <TextareaAutosize
                    minRows={10} placeholder="A transcrição do áudio aparecerá aqui..."
                    value={transcript} readOnly
                    style={{ width: '100%', padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
            </Paper>
        </Container>
    );
}

export default NewConsultationPage;