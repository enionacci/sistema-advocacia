// src/components/PapelDialog.js
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
    FormGroup, FormControlLabel, Checkbox, Typography
} from '@mui/material';

function PapelDialog({ open, onClose, onSave, papel, permissoes }) {
    const [nome, setNome] = useState('');
    const [selectedPermissoes, setSelectedPermissoes] = useState([]);

    useEffect(() => {
        if (papel) {
            setNome(papel.nome || '');
            setSelectedPermissoes(papel.permissoes || []);
        } else {
            setNome('');
            setSelectedPermissoes([]);
        }
    }, [papel, open]);

    const handlePermissaoChange = (permissaoId) => {
        setSelectedPermissoes(prev => 
            prev.includes(permissaoId) 
                ? prev.filter(id => id !== permissaoId) 
                : [...prev, permissaoId]
        );
    };

    const handleSave = () => {
        onSave({ ...papel, nome, permissoes: selectedPermissoes });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{papel ? 'Editar Papel' : 'Criar Novo Papel'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nome do Papel"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    sx={{ mb: 3 }}
                />
                <Typography variant="h6" gutterBottom>Permissões</Typography>
                <FormGroup>
                    {permissoes.map(permissao => (
                        <FormControlLabel
                            key={permissao.id}
                            control={
                                <Checkbox 
                                    checked={selectedPermissoes.includes(permissao.id)}
                                    onChange={() => handlePermissaoChange(permissao.id)}
                                />
                            }
                            label={permissao.nome}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PapelDialog;
