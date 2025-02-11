import axios from "axios";
import { prepareBodyWithSign } from "./auth";
import { API_BASE_URL } from "./common";
import {
  ApiError,
  CreateGuildParams,
  CreateGuildResponse,
  CreateRoleParams,
  CreateRoleResponse,
  DeleteGuildResponse,
  DeleteRoleResponse,
  GetGuildsResponse,
  GetGuildByIdResponse,
  GetMembershipsResponse,
  GetRoleResponse,
  GetUserAccessResponse,
  JoinResponse,
  SignerFunction,
  UpdateGuildParams,
  UpdateRoleParams,
  UpdateRoleResponse,
  GuildsQueryType,
  GuildsByAddressQueryType,
} from "./types";

const headers = { "Content-Type": "application/json" };

const user = {
  async getMemberships(
    address: string
  ): Promise<GetMembershipsResponse | null> {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/membership/${address}`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
};

const guild = {
  async getAll(query: GuildsQueryType = {}): Promise<GetGuildsResponse> {
    const queryParams: GuildsQueryType = {}
    if (query.order) queryParams.order = query.order
    if (query.search) queryParams.search = query.search
    const searchParams = new URLSearchParams(queryParams).toString()

    const res = await axios.get(`${API_BASE_URL}/guild?${searchParams}`);
    return res.data;
  },

  async getByAddress(address: string, query: GuildsByAddressQueryType = {}): Promise<GetGuildsResponse> {
    const queryParams: GuildsByAddressQueryType = {}
    if (query.order) queryParams.order = query.order
    if (query.search) queryParams.search = query.search
    queryParams.include = query.include ?? "all"
    const searchParams = new URLSearchParams(queryParams).toString()

    const res = await axios.get(`${API_BASE_URL}/guild/address/${address}?${searchParams}`);
    return res.data;
  },

  async get(id: number | string): Promise<GetGuildByIdResponse> {
    const res = await axios.get(`${API_BASE_URL}/guild/${id}`);
    if (res.status === 204) {
      return null;
    }
    return res.data;
  },

  async getUserAccess(
    guildId: number,
    address: string
  ): Promise<GetUserAccessResponse> {
    const res = await axios.get(
      `${API_BASE_URL}/guild/access/${guildId}/${address}`
    );
    return res.data;
  },

  async getUserMemberships(
    guildId: number,
    address: string
  ): Promise<GetUserAccessResponse> {
    const res = await axios.get(
      `${API_BASE_URL}/guild/member/${guildId}/${address}`
    );
    return res.data;
  },

  async create(
    signerAddress: string,
    sign: SignerFunction,
    params: CreateGuildParams
  ): Promise<CreateGuildResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.post(`${API_BASE_URL}/guild`, body, { headers });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  // TODO id string (urlName) ?
  async update(
    id: number,
    signerAddress: string,
    sign: SignerFunction,
    params: UpdateGuildParams
  ) {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.patch(`${API_BASE_URL}/guild/${id}`, body, {
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async delete(
    id: number,
    signerAddress: string,
    sign: SignerFunction
  ): Promise<DeleteGuildResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign);
    try {
      const res = await axios.delete(`${API_BASE_URL}/guild/${id}`, {
        data: body,
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
  
  async join(
    guildId: number,
    signerAddress: string,
    sign: SignerFunction
  ): Promise<JoinResponse> {
    try {
      const body = await prepareBodyWithSign(signerAddress, sign, { guildId });
      const res = await axios.post(`${API_BASE_URL}/user/join/`, body, {
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
};

const role = {
  async get(id: number): Promise<GetRoleResponse> {
    const res = await axios.get(`${API_BASE_URL}/role/${id}`);
    if (res.status === 204) {
      return null;
    }
    return res.data;
  },

  async create(
    signerAddress: string,
    sign: SignerFunction,
    params: CreateRoleParams
  ): Promise<CreateRoleResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.post(`${API_BASE_URL}/role`, body, { headers });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async update(
    id: number,
    signerAddress: string,
    sign: SignerFunction,
    params: UpdateRoleParams
  ): Promise<UpdateRoleResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign, params);
    try {
      const res = await axios.patch(`${API_BASE_URL}/role/${id}`, body, {
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },

  async delete(
    id: number,
    signerAddress: string,
    sign: SignerFunction
  ): Promise<DeleteRoleResponse> {
    const body = await prepareBodyWithSign(signerAddress, sign);
    try {
      const res = await axios.delete(`${API_BASE_URL}/role/${id}`, {
        data: body,
        headers,
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data.errors) {
        throw new ApiError(error.response.data.errors);
      } else {
        throw error;
      }
    }
  },
};

export { user, guild, role };
