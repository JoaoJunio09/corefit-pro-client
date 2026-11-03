import api from "./api";

export interface AccountProfile {
  username: string;
  fullName: string;
  email: string;
  recoveryEmail: string;
}

export default class AccountService {
  private readonly baseUrl = "/api/account/v1";
  constructor(private readonly accessToken: string) {}
  private get config() {
    return { headers: { Authorization: `Bearer ${this.accessToken}` } };
  }
  async get() {
    return (await api.get<AccountProfile>(this.baseUrl, this.config)).data;
  }
  async update(profile: AccountProfile) {
    return (await api.put<AccountProfile>(this.baseUrl, profile, this.config))
      .data;
  }
  async changePassword(currentPassword: string, newPassword: string) {
    await api.put(
      `${this.baseUrl}/password`,
      { currentPassword, newPassword },
      this.config,
    );
  }
}
