import { IUserCreate } from "../../src/models/user/index/types";

class UserData {
  public static readonly user1: IUserCreate = {
    username: "wepiss",
    email: "wepiss@gmail.com",
    password: "demonlover",
  };

  public static readonly user2: IUserCreate = {
    username: "hilda",
    email: "hilda@gmail.com",
    password: "hildaaa",
  };

  public static readonly user3: IUserCreate = {
    username: "ben10",
    email: "maxten@gmail.com",
    password: "gwenten",
  };

  public static readonly badUser1: IUserCreate = {
    username: "wepiss1",
    email: "hilda@gmail.com",
    password: "demonlover2",
  };

  public static readonly users = [
    UserData.user1,
    UserData.user2,
    UserData.user3,
  ];
}

export default UserData;
