import { Button, StandardTextFieldProps, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useState } from 'react';

export type Field = {
    value: string;
    label: string;
    key: string;
};

interface DialogProps {
    open: boolean;
    close: () => void;
    submit: (body: Record<string, string>) => Promise<void>;
    fields: Array<Field>;
    title: string;
}

const FormDialog: React.FC<DialogProps> = ({
    close,
    open,
    submit,
    fields,
    title,
}) => {
    const [textFields, setFields] = useState<Array<Field>>(fields);
    const [loading, setLoading] = useState(false);
    const handleSubmit = useCallback(() => {
        setLoading(true);
        const body = {};
        for (const item of textFields) {
            body[item.key] = item.value;
        }
        submit(body).finally(() => {
            setLoading(false);
        });
    }, [textFields, submit]);

    const handleChange: (
        key: string,
    ) => React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (key) => (event) => {
            const value = event.target.value;
            setFields((prvState) => {
                const objIndex = prvState.findIndex((item) => item.key === key);
                const cp = structuredClone(prvState);

                if (objIndex === -1) {
                    return prvState;
                }
                cp[objIndex] = {
                    ...prvState[objIndex],
                    value,
                };
                return cp;
            });
        },
        [],
    );

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {title}
                </DialogContentText>
                {textFields.map((item, index) => (
                    <TextField
                        key={index}
                        autoFocus
                        value={item.value}
                        onChange={handleChange(item.key)}
                        margin='dense'
                        label={item.label}
                        fullWidth
                        variant='standard'
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <Button disabled={loading} onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default FormDialog;
