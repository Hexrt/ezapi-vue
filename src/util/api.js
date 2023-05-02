import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:10086", // replace with your back-end API's URL
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    treeApi(){
        return apiClient.get("/api/tree");
    },
    saveApi(apiInfo) {
        return apiClient.post("/ezapi/code/resource/file/api/save", apiInfo);
    },

    jdbcTest(base) {
        return apiClient.post("/ezapi/code/datasource/jdbc/test", base);
    },

    saveJdbc(base) {
        return apiClient.post(
            "/ezapi/code/resource/file/datasource/save",
            base
        );
    },

    deleteJdbc(base) {
        return apiClient.post("/ezapi/code/resource/delete", base);
    },

    saveFolder(folder) {
        return apiClient.post("/ezapi/code/resource/folder/save", folder);
    },
};
