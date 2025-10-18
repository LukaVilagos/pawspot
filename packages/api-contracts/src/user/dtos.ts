// Request DTOs
export type UserFilters = {
    email?: string;
    name?: string;
    createdAt?: {
        gte?: Date;
        lte?: Date;
    };
};

// Response DTOs
export type UserResponseDto = {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type UsersListResponseDto = UserResponseDto[];
