import type {
    AnimalResponse,
    CreateAnimalRequest,
    UpdateAnimalRequest,
    PaginatedResponse,
    QueryOptions,
} from "@pawspot/api-contracts";

export const useAnimalApi = () => {
    const getAnimalById = async (id: string) => {
        return await useAuthFetch<AnimalResponse>(`/api/animal/${id}`);
    };

    const createAnimal = async (payload: CreateAnimalRequest) => {
        return await $fetch<AnimalResponse>("/api/animal", {
            method: "POST",
            body: payload,
        });
    };

    const updateAnimal = async (id: string, payload: UpdateAnimalRequest) => {
        return await $fetch<AnimalResponse>(`/api/animal/${id}`, {
            method: "PUT",
            body: payload,
        });
    };

    const deleteAnimal = async (id: string) => {
        return await $fetch<{ message: string }>(`/api/animal/${id}`, {
            method: "DELETE",
        });
    };

    const searchAnimals = async (query: QueryOptions<AnimalResponse>) => {
        return await $fetch<PaginatedResponse<AnimalResponse>>(
            "/api/animal/search",
            {
                method: "POST",
                body: query,
            }
        );
    };

    return {
        getAnimalById,
        createAnimal,
        updateAnimal,
        deleteAnimal,
        searchAnimals,
    };
};
