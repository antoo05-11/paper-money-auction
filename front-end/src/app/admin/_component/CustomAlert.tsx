import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CustomAlertProps {
    variant: 'BAN' | 'UNDO';
}

export function CustomAlert({ variant }: CustomAlertProps) {
    let headerText;
    let descriptionText;

    if (variant === 'BAN') {
        headerText = "Xác nhận đình chỉ người dùng ?";
        descriptionText = "Hành động này sẽ đình chỉ người dùng và họ sẽ không thể truy cập vào tài khoản của mình nữa.";
    } else if (variant === 'UNDO') {
        headerText = "Xác nhận hủy đình chỉ người dùng ?";
        descriptionText = "Hành động này sẽ hủy đình chỉ và người dùng có thể truy cập vào tài khoản của mình lại.";
    }
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{headerText}</AlertDialogTitle>
                <AlertDialogDescription>
                    {descriptionText}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction>Xác nhận</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
