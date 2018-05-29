package com.imooc.mvcdemo.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.imooc.mvcdemo.model.User;
import com.imooc.mvcdemo.service.IUserService;

@Service("userService")
public class UserServiceImpl implements IUserService {

    @Override
    public User findUserByName(String username) {
        User user = new User();
        user.setUsername(username);
        user.setPassword("123");
        user.setEmail(username+"@163.com");
        user.setAge(27);

        return user;
    }

    @Override
    public List<User> queryList(int limit) {

        List<User> list = new ArrayList<>(limit);
        for (int i=0; i<limit;i++){
            User user = new User();
            user.setUsername("ricky_"+i);
            user.setPassword("12345");
            user.setAge(i);

            list.add(user);
        }

        return list;
    }
}