import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { faker } from "@faker-js/faker";

// DEV ONLY!!
const pause = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const albumsApi = createApi({
  reducerPath: "albums",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3005",
    fetchFn: async (...args) => {
      // DEV ONLY!!
      await pause(1000);
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      // useRemoveAlbumMutation
      removeAlbum: builder.mutation({
        invalidatesTags: (result, error, album) => {
          return [{ type: "Album", id: album.id }];
        },
        query: (album) => {
          return {
            url: `/albums/${album.id}`,
            method: "DELETE",
          };
        },
      }),

      //useAddAlbumMutation
      addAlbum: builder.mutation({
        // after this hook is called, we will be marking below all mentioned hooks as stale, so they will have to run again automatically
        invalidatesTags: (result, error, user) => {
          return [{ type: "UsersAlbums", id: user.id }];
        },
        query: (user) => {
          return {
            url: "/albums",
            method: "POST",
            body: {
              userId: user.id,
              title: faker.commerce.productName(),
            },
          };
        },
      }),

      // by creating this fetchAlbums here, we will get a hook that we can use by the name: albumsApi.useFetchAlbumsQuery()
      fetchAlbums: builder.query({
        // tagging this hook with a string 'Album'
        providesTags: (result, error, user) => {
          const tags = result.map((album) => {
            return { type: "Album", id: album.id };
          });

          tags.push({ type: "UsersAlbums", id: user.id });

          return tags;
        },
        
        query: (user) => {
          return {
            url: "/albums",
            params: {
              userId: user.id,
            },
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  useRemoveAlbumMutation,
  useFetchAlbumsQuery,
  useAddAlbumMutation,
} = albumsApi;
export { albumsApi };
