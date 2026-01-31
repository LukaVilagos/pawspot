import type {
    SanctuaryResponse,
    CreateSanctuaryRequest,
    UpdateSanctuaryRequest,
    PaginatedResponse,
    QueryOptions,
    UserSummary,
} from "@pawspot/api-contracts";

export const useSanctuaryApi = () => {
    const getSanctuaryById = async (id: string) => {
        return await useAuthFetch<SanctuaryResponse>(`/api/sanctuary/${id}`);
    };

    const createSanctuary = async (payload: CreateSanctuaryRequest) => {
        return await $fetch<SanctuaryResponse>("/api/sanctuary", {
            method: "POST",
            body: payload,
        });
    };

    const updateSanctuary = async (id: string, payload: UpdateSanctuaryRequest) => {
        return await $fetch<SanctuaryResponse>(`/api/sanctuary/${id}`, {
            method: "PUT",
            body: payload,
        });
    };

    const deleteSanctuary = async (id: string) => {
        return await $fetch<{ message: string }>(`/api/sanctuary/${id}`, {
            method: "DELETE",
        });
    };

    const searchSanctuaries = async (query: QueryOptions<SanctuaryResponse>) => {
        return await $fetch<PaginatedResponse<SanctuaryResponse>>(
            "/api/sanctuary/search",
            {
                method: "POST",
                body: query,
            }
        );
    };

    const addContributor = async (sanctuaryId: string, userId: string) => {
        return await $fetch<SanctuaryResponse>(
            `/api/sanctuary/${sanctuaryId}/contributors`,
            {
                method: "POST",
                body: { userId },
            }
        );
    };

    const removeContributor = async (sanctuaryId: string, userId: string) => {
        return await $fetch<SanctuaryResponse>(
            `/api/sanctuary/${sanctuaryId}/contributors`,
            {
                method: "DELETE",
                body: { userId },
            }
        );
    };

    const searchContributors = async (sanctuaryId: string, query: QueryOptions<UserSummary>) => {
        return await $fetch<PaginatedResponse<UserSummary>>(
            `/api/sanctuary/${sanctuaryId}/contributors/search`,
            {
                method: "POST",
                body: query,
            }
        );
    };

    return {
        getSanctuaryById,
        createSanctuary,
        updateSanctuary,
        deleteSanctuary,
        searchSanctuaries,
        addContributor,
        removeContributor,
        searchContributors,
    };
};
