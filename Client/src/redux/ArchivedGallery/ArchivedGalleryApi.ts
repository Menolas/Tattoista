import {instance} from "../../http";
import {GalleryItemType, CommonResponseFields} from "../../types/Types";

type DeleteGalleryItemResponseType = CommonResponseFields;

type GetGalleryItemsResponseType = CommonResponseFields & {
    gallery: Array<GalleryItemType>;
    totalCount: number;
}

type UpdateArchiveGalleryItemResponseType = CommonResponseFields & {
    archivedGalleryItem: GalleryItemType;
}

type ReactivateArchivedGalleryItemResponseType = CommonResponseFields;

export const archivedGalleryApi = {

    async getArchivedGalleryItems(
        currentPage: number,
        pageSize: number
    ) {
        return await instance.get<GetGalleryItemsResponseType>(`gallery/archive?&page=${currentPage}&limit=${pageSize}`)
            .then(response => response.data);
    },

    async deleteArchivedGalleryItem(
        itemId: string
    ) {
        return await instance.delete<DeleteGalleryItemResponseType>(`gallery/archive/${itemId}`)
            .then(response => response.data);
    },

    async updateArchiveGalleryItem(id: string, values: object) {
        return await instance.patch<UpdateArchiveGalleryItemResponseType>(`gallery/updateArchivedGalleryItem/${id}`, {values})
            .then(response => response.data);
    },

    async reactivateArchivedGalleryItem(id: string) {
        return await instance.get<ReactivateArchivedGalleryItemResponseType>(`gallery/reactivate/${id}`)
            .then(response => response.data);
    }
};
