package com.imooc.mvcdemo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.imooc.mvcdemo.model.User;
import com.imooc.mvcdemo.service.IUserService;

@Controller
@RequestMapping("/user")
public class RESTfulJSONController {

  @Autowired
  private IUserService userService;

  /** Spring MVC RESTful JSON **/
  @RequestMapping(value = "/view/{username}", method = RequestMethod.GET)
  @ResponseBody
  public User view(@PathVariable String username) {

    System.out.println("view username:" + username);

    return userService.findUserByName(username);
  }

  @RequestMapping(value = "/query", method = RequestMethod.GET)
  @ResponseBody
  public User query(@RequestParam(value = "username", required = true) String username) {

    System.out.println("view username:" + username);

    return userService.findUserByName(username);
  }

}
