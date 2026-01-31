import type {
    PostResponse,
    CreatePostRequest,
    UpdatePostRequest,
    PaginatedResponse,
    QueryOptions,
} from "@pawspot/api-contracts";

export const usePostApi = () => {
    const getPostById = async (id: string) => {
        return await useAuthFetch<PostResponse>(`/api/post/${id}`);
    };

    const createPost = async (payload: CreatePostRequest) => {
        return await $fetch<PostResponse>("/api/post", {
            method: "POST",
            body: payload,
        });
    };

    const updatePost = async (id: string, payload: UpdatePostRequest) => {
        return await $fetch<PostResponse>(`/api/post/${id}`, {
            method: "PUT",
            body: payload,
        });
    };

    const deletePost = async (id: string) => {
        return await $fetch<{ message: string }>(`/api/post/${id}`, {
            method: "DELETE",
        });
    };

    const searchPosts = async (query: QueryOptions<PostResponse>) => {
        return await $fetch<PaginatedResponse<PostResponse>>(
            "/api/post/search",
            {
                method: "POST",
                body: query,
            }
        );
    };

    return {
        getPostById,
        createPost,
        updatePost,
        deletePost,
        searchPosts,
    };
};
