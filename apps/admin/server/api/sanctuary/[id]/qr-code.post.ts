import { SanctuaryAdminContract } from "@pawspot/api-contracts";

export default defineEventHandler(
    async (event): Promise<typeof SanctuaryAdminContract.generateQrCode.response> => {
        const { id } = (event.context?.params ?? {}) as { id: string };

        return await protectedServerFetch<typeof SanctuaryAdminContract.generateQrCode.response>(
            event,
            `${SanctuaryAdminContract.generateQrCode.build({ id })}`,
            {
                method: SanctuaryAdminContract.generateQrCode.method,
            }
        );
    }
);
