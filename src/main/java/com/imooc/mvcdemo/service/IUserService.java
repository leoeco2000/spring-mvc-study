package com.imooc.mvcdemo.service;

import java.util.List;
import com.imooc.mvcdemo.model.User;

public interface IUserService {

  User findUserByName(String username);

  List<User> queryList(int limit);

}
