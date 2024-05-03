import userRole from "../constants/user.role";
import TransactionController from "../controllers/transaction.controller";
import transactionValidation from "../validations/transaction.validation";

export default [
    {
        controller: TransactionController,
        methods: [
            {
                httpMethod: "get",
                path: "/payment/:auctionId",
                method: "checkPayment",
                roles: [userRole.AUCTIONEER],
            },
            {
                httpMethod: "post",
                path: "/payment/:auctionId",
                method: "pay",
                roles: [userRole.CUSTOMER],
                schema: transactionValidation.payment,
            },
        ],
    },
];
