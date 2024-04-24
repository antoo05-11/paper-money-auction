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
    variant: 'BAN' | 'UNDO' | 'DELETE' | 'APPROVE';
}

export function CustomAlert({ variant }: CustomAlertProps) {
    let headerText;
    let descriptionText;

    switch (variant) {
        case "BAN":
            headerText = "Xác nhận đình chỉ người dùng ?";
            descriptionText = "Hành động này sẽ đình chỉ người dùng và họ sẽ không thể truy cập vào tài khoản của mình nữa.";
            break;
        case "UNDO":
            headerText = "Xác nhận hủy đình chỉ người dùng ?";
            descriptionText = "Hành động này sẽ hủy đình chỉ và người dùng có thể truy cập vào tài khoản của mình lại.";
            break;
        case "DELETE":
            headerText = "Xác nhận xóa tài sản ?";
            descriptionText = "Hành động này sẽ xóa tài sản của bạn khỏi hệ thống.";
            break;
        case "APPROVE":
            headerText = "Xác nhận gửi tài sản cho quản trị viên phê duyệt ?";
            descriptionText = "Hành động này sẽ chuyển tài sản của bạn đến quản trị viên để phê duyệt.";
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
