import {useState} from "react";
import {Box, Container, Divider, IconButton, Modal, Stack, Typography} from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const useModal = (ModalBody, heading) => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const CustomModal = ({ ModalBody, heading, modalProps }) => (
        <Modal
            open={isOpen}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            disableEnforceFocus
            sx={{
                overflow: 'hidden', // Zabrání scrollování v mobilním prohlížeči při otevřeném modálu
            }}
        >
            <Container
                maxWidth="sm" // Maximální šířka kontejneru (sm = 600px, můžeš upravit podle potřeby)
                sx={{
                    position: 'fixed', // Fixní pozice, aby modal zůstal na místě i při scrollování nebo otevření klávesnice
                    top: '50%', // Vertikální centrování
                    left: '50%', // Horizontální centrování
                    transform: 'translate(-50%, -50%)', // Posun, aby bylo okno přesně uprostřed
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh', // Omezí výšku na 90 % obrazovky
                    maxWidth: '90vw', // Omezí šířku na 90 % šířky obrazovky, pro lepší vzhled na mobilu
                    overflowY: 'auto', // Umožní scrollovat uvnitř modálu, pokud je obsah příliš velký
                }}
            >
                    <Stack direction={"row"} alignItems={'center'} justifyContent={'space-between'} pb={2}>
                        <Typography variant={'h5'}>{heading}</Typography>
                        <IconButton
                            sx={{
                                position: 'relative',
                                right: '-12px', // Posun o pár pixelů doprava
                            }}
                            onClick={() => closeModal()}>
                            <CloseRoundedIcon/>
                        </IconButton>
                    </Stack>
                <ModalBody closeModal={closeModal} {...modalProps}/>
            </Container>
        </Modal>
    );

    return {
        isOpen,
        openModal,
        closeModal,
        CustomModal,
    };
};
export default useModal;