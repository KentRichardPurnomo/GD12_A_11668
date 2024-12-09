import useAxios from ".";

export const GetAllKomentar = async () => {
  try {
    const response = await useAxios.get("/komentar", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data; 
  } catch (error) {
    throw error.response.data;
  }
};

export const GetAllKomentarByUserId = async (id) => {
  try {
    const response = await useAxios.get(`/komentar/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetAllKomentarByContentId = async (contentId) => {
  try {
    const response = await useAxios.get(`/komentar/content/${contentId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const CreateKomentar = async (data) => {
  try {
    const response = await useAxios.post("/komentar", data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const UpdateKomentar = async (values) => {
  try {
    const response = await useAxios.put(`/komentar/${values.id}`, values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const DeleteKomentar = async (id) => {
  try {
    const response = await useAxios.delete(`/komentar/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
