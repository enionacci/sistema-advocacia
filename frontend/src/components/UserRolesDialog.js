// src/components/UserRolesDialog.js
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    FormGroup, FormControlLabel, Checkbox, Typography
} from '@mui/material';

function UserRolesDialog({ open, onClose, onSave, user, papeis }) {
    const [selectedPapeis, setSelectedPapeis] = useState([]);

    useEffect(() => {
        if (user) {
            // The `user` prop is a `perfil` object, and `user.papeis` is a list of role names (strings)
            // We need to find the corresponding role objects from the `papeis` prop to get their IDs
            const userPapelIds = papeis
                .filter(papel => user.papeis.includes(papel.nome))
                .map(papel => papel.id);
            setSelectedPapeis(userPapelIds);
        } else {
            setSelectedPapeis([]);
        }
    }, [user, open, papeis]);

    const handlePapelChange = (papelId) => {
        setSelectedPapeis(prev => 
            prev.includes(papelId) 
                ? prev.filter(id => id !== papelId) 
                : [...prev, papelId]
        );
    };

    const handleSave = () => {
        onSave(user.id, selectedPapeis);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Papéis de {user?.user.username}</DialogTitle>
            <DialogContent>
                <Typography variant="h6" gutterBottom>Papéis</Typography>
                <FormGroup>
                    {papeis.map(papel => (
                        <FormControlLabel
                            key={papel.id}
                            control={
                                <Checkbox 
                                    checked={selectedPapeis.includes(papel.id)}
                                    onChange={() => handlePapelChange(papel.id)}
                                />
                            }
                            label={papel.nome}
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

export default UserRolesDialog;