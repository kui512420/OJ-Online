package space.kuikui.oj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import space.kuikui.oj.common.BaseResponse;
import space.kuikui.oj.common.ErrorCode;
import space.kuikui.oj.common.JwtLoginUtils;
import space.kuikui.oj.common.ResultUtils;
import space.kuikui.oj.exception.BusinessException;
import space.kuikui.oj.mapper.UserMapper;
import space.kuikui.oj.model.dto.*;
import space.kuikui.oj.model.entity.User;
import space.kuikui.oj.model.entity.UserRank;
import space.kuikui.oj.service.QuestionSubmitService;
import space.kuikui.oj.service.RedisSetTokenExample;
import space.kuikui.oj.service.UserRankService;
import space.kuikui.oj.service.UserService;
import space.kuikui.oj.utils.CaptchaUtil;
import space.kuikui.oj.utils.ExportUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

// 添加文件处理相关的导入
import cn.hutool.core.io.FileTypeUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileWriter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.io.File;

/**
 * @author kuikui
 * @date 2025/3/15 16:14
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Resource
    private UserService userService;


    @Resource
    private CaptchaUtil captchaUtil;
    @Resource
    private JwtLoginUtils jwtLoginUtils;

    @Resource
    private RedisSetTokenExample redisSetTokenExample;
    @Autowired
    private UserMapper userMapper;
    @Resource
    private UserRankService userRankService;

    // 文件上传路径配置 - 修改为与springcloud项目一致的相对路径
    private final static String USER_HEADER_PATH = System.getProperty("user.dir") + File.separator + "data" + File.separator + "userHeader" + File.separator;
    private final static String QUESTION_CONTENT_PATH = System.getProperty("user.dir") + File.separator + "data" + File.separator + "questionContent" + File.separator;

    /**
     * 获取通过题目数量排行榜
     * @param limit 返回记录数量
     * @return 排行榜列表
     */
    @GetMapping("/rank/accept-count")
    public BaseResponse<Page<UserRank>> getTopUsersByAcceptCount(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<UserRank> rankPage = userRankService.getTopUsersByAcceptCount(current, pageSize);
        return ResultUtils.success("获取通过题目数量排行榜成功", rankPage);
    }

    /**
     * 获取提交数量排行榜
     * @param limit 返回记录数量
     * @return 排行榜列表
     */
    @GetMapping("/rank/submit-count")
    public BaseResponse<Page<UserRank>> getTopUsersBySubmitCount(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<UserRank> rankPage = userRankService.getTopUsersBySubmitCount(current, pageSize);
        return ResultUtils.success("获取提交数量排行榜成功", rankPage);
    }

    /**
     * 获取通过率排行榜
     * @param limit 返回记录数量
     * @return 排行榜列表
     */
    @GetMapping("/rank/accept-rate")
    public BaseResponse<Page<UserRank>> getTopUsersByAcceptRate(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<UserRank> rankPage = userRankService.getTopUsersByAcceptRate(current, pageSize);
        return ResultUtils.success("获取通过率排行榜成功", rankPage);
    }

    /**
     * 获取指定用户的排名信息
     * @param userId 用户ID
     * @return 用户排名信息
     */
    @GetMapping("/rank/user/{userId}")
    public BaseResponse<UserRank> getUserRankByUserId(@PathVariable Long userId) {
        UserRank userRank = userRankService.getUserRankByUserId(userId);
        return ResultUtils.success("获取用户排名信息成功", userRank);
    }
    /**
     * @todo 用户注册
     * @param userRegisterRequest
     * @param request
     * @return
     */
    @PostMapping("/register")
    public BaseResponse<Map<String,String>> register(@RequestBody UserRegisterRequest userRegisterRequest, HttpServletRequest request) {
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String userCheakPassword = userRegisterRequest.getUserCheakPassword();
        String email = userRegisterRequest.getEmail();
        String emailCode = userRegisterRequest.getEmailCode();
        Map<String,String> result = userService.userRegister(userAccount,userPassword,userCheakPassword,email,emailCode,request);

        return ResultUtils.success("注册成功",result);
    }

    /**
     * @todo 用户登录
     * @param userLoginRequset
     * @param request
     * @return
     */
    @PostMapping("/login")
    public BaseResponse<Map<String,String>> login(@RequestBody UserLoginRequset userLoginRequset, HttpServletRequest request) {
        String user = userLoginRequset.getUser();
        String userPassword = userLoginRequset.getPassword();
        String code = userLoginRequset.getCode();

        Map<String,String> result = userService.userLogin(user,userPassword,code,request);
        return ResultUtils.success("登录成功",result);
    }

    /**
     * 用户退出登录
     * @param accessToken
     * @return
     */
    @PostMapping("/OutLogin")
    public BaseResponse<Boolean> outLogin(String accessToken) {

        boolean isDel = redisSetTokenExample.deleteTokenFromSet((String) jwtLoginUtils.jwtPeAccess(accessToken).get("id"),accessToken);
        return ResultUtils.success("退出登录成功",isDel);
    }

    /**
     * @todo 获取登录信息
     * @param accessToken
     * @return
     */
    @GetMapping("/get/login")
    public BaseResponse<Map<Object, Object>> getLogin(@RequestHeader(value = "Accesstoken",required = false) String accessToken) {
        Map<Object, Object> map = new HashMap<>();
        map = jwtLoginUtils.jwtPeAccess(accessToken);
        return ResultUtils.success("获取信息成功",map);
    }

    /**
     * @todo 发送邮箱
     * @param emailRequest
     * @return
     */
    @PostMapping("/email")
    public BaseResponse<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        String result = userService.sendEmail(emailRequest.getEmail());
        return ResultUtils.success("发送成功",result);
    }

    /**
     * @todo 显示验证码
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/captcha")
    public void captcha(HttpServletRequest request, HttpServletResponse response) throws IOException {
        captchaUtil.outCodeImg(request, response);
    }

    /**
     * @todo 修改名称
     * @param accessToken
     * @return
     */
    @PutMapping("/userName")
    public BaseResponse<String> setUerName(@RequestHeader(value = "Accesstoken",required = false) String accessToken,@RequestBody String userName) {
        Map<Object, Object> map = jwtLoginUtils.jwtPeAccess(accessToken);
        long id = Long.valueOf((String) map.get("id"));
        int count = userService.updateUserName(id,userName);
        return ResultUtils.success("修改成功",count+"");
    }
    /**
     * @todo 修改个人简介
     * @param accessToken
     * @return
     */
    @PutMapping("/userProfile")
    public BaseResponse<String> setUserProfile(@RequestHeader(value = "Accesstoken",required = false) String accessToken,@RequestBody String userProfile) {
        Map<Object, Object> map = jwtLoginUtils.jwtPeAccess(accessToken);
        long id = Long.valueOf((String) map.get("id"));
        int count = userService.updateUserProfile(id,userProfile);
        return ResultUtils.success("修改成功",count+"");
    }

    /**
     * @todo 修改密码
     * @param accessToken
     * @param userPasswordRequest 包含原密码和新密码
     * @return
     */
    @PutMapping("/userPassword")
    public BaseResponse<String> setUserPassword(@RequestHeader(value = "Accesstoken" ,required = false) String accessToken, @RequestBody UserPasswordRequest userPasswordRequest) {
        Map<Object, Object> map = jwtLoginUtils.jwtPeAccess(accessToken);
        long id = Long.valueOf((String) map.get("id"));
        int count = userService.updateUserPassword(id,userPasswordRequest.getUsrePassword(),userPasswordRequest.getNewUserPassword(),userPasswordRequest.getEmail(),userPasswordRequest.getCode());
        return ResultUtils.success("修改成功",count+"");
    }

    /**
     * 查询用户列表
     * @param userListRequest
     * @return
     */
    @PostMapping("/userList")
    public BaseResponse<Page<User>> getUserList(@RequestBody UserListRequest userListRequest) {
        Page<User> userList = userService.userList(userListRequest);
        return ResultUtils.success("查询成功",userList);
    }

    /**
     * 删除单个用户
     * @param id
     * @return
     */
    @DeleteMapping("/user/{id}")
    public BaseResponse<Boolean> deleteUser(@PathVariable Long id) {
        boolean result = userService.removeById(id);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "用户不存在");
        }
        return ResultUtils.success("删除成功",true);
    }
    /**
     * 删除多个用户
     * @param ids 用户 ID 列表
     * @return 删除结果
     */
    @DeleteMapping("/user")
    public BaseResponse<Boolean> deleteUsers(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.PARMS_ERROR, "用户 ID 列表不能为空");
        }
        boolean result = userService.removeByIds(ids);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "部分或全部用户删除失败");
        }
        return ResultUtils.success("删除成功", true);
    }
    /**
     * 更改用户状态
     * @param id
     * @return
     */
    @PutMapping("/user/{id}/{userRole}")
    public BaseResponse<Integer> putUserRole(@PathVariable Long id, @PathVariable String userRole) {
        Integer result = userService.putUserRole(id,userRole);
        return ResultUtils.success("更改成功",result);
    }
    /**
     * 更改用户信息
     * @param userInfoRequest
     * @return
     */
    @PutMapping("/userInfo")
    public BaseResponse<Integer> putUserRole(@RequestBody UserInfoRequest userInfoRequest) {
        Integer result = userService.updateInfo(userInfoRequest);
        return ResultUtils.success("更改成功",result);
    }

    /**
     * 管理员修改用户信息（密码，名称，邮箱，角色）
     * @param userInfoRequest 用户信息请求对象
     * @return 修改结果
     */
    @PutMapping("/admin/user/info")
    public BaseResponse<Integer> updateUserInfo(@RequestBody UserInfoRequest userInfoRequest) {
        // 验证权限可以在拦截器中进行
        Integer result = userService.updateInfo(userInfoRequest);
        return ResultUtils.success("用户信息修改成功", result);
    }

    /**
     * 更新个人信息-刷新延续token
     * @param accessToken
     * @return
     */
    @GetMapping("/refreshToken")
    public BaseResponse<String> refreshToken(@RequestHeader(value = "Accesstoken") String accessToken) {
        String token = "";
        try{

            Long id = Long.valueOf((String) jwtLoginUtils.jwtPeAccess(accessToken).get("id"));
            Long RemainingTime = redisSetTokenExample.getTokenRemainingTime(String.valueOf(id),TimeUnit.MILLISECONDS);
            boolean isDel = redisSetTokenExample.deleteTokenFromSet(String.valueOf(id),accessToken);

            User user = userMapper.findUserById(id);
            token = jwtLoginUtils.jwtBdAccess(user);
            redisSetTokenExample.deleteTokenFromSet(String.valueOf(id),accessToken);
            // 设置 延续剩余的时间
            redisSetTokenExample.saveTokenToSet(String.valueOf(id),token,RemainingTime, TimeUnit.MILLISECONDS);
        }catch (Exception e){
            return ResultUtils.error(50000,"刷新token失败",null);
        }
        return ResultUtils.success("刷新token成功",token);
    }

    /**
     * @todo 上传头像
     * @param file
     * @param accesstoken
     * @throws IOException
     */
    @PostMapping(value = "/file/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "上传文件", description = "支持文件上传，返回 JSON 格式响应",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE
                           )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "文件上传成功",
                            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
            })
    public void uploadFile(@RequestParam("file") MultipartFile file,@RequestHeader(value = "Accesstoken",required = false) String accesstoken) throws IOException {
        // 检查用户头像目录是否存在
        boolean isExist = FileUtil.exist(USER_HEADER_PATH);

        // 不存在就创建目录
        if(!isExist){
            FileUtil.mkdir(USER_HEADER_PATH);
        }
        Map<Object, Object> map = jwtLoginUtils.jwtPeAccess(accesstoken);
        String id = map.get("id").toString();
        StringBuilder header = new StringBuilder();
        header.append(USER_HEADER_PATH).append(id).append(".png");
        // 获取文件的类型
        String type = FileTypeUtil.getType(file.getInputStream());
        if(!StringUtils.containsAny(type,"jpg","jpeg","png")){
            // System.out.println("非图片文件");
        }else{
            FileWriter writer = new FileWriter(String.valueOf(header));
            writer.writeFromStream(file.getInputStream());
            userService.updateUserAvatar(Long.valueOf(id),"api/user/file/userheader/"+id+".png");
        }
    }

    /**
     * @todo 上传题目图片
     * @param file
     * @param accesstoken
     * @throws IOException
     */
    @PostMapping(value = "/file/upload/question", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "上传文件", description = "支持文件上传，返回 JSON 格式响应",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE
                    )
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "文件上传成功",
                            content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
            })
    public String uploadQuestionFile(@RequestParam("file") MultipartFile file,@RequestHeader(value = "Accesstoken",required = false) String accesstoken) throws IOException {
        // 检查用户头像目录是否存在
        boolean isExist = FileUtil.exist(QUESTION_CONTENT_PATH);

        // 不存在就创建目录
        if(!isExist){
            FileUtil.mkdir(QUESTION_CONTENT_PATH);
        }
        Map<Object, Object> map = jwtLoginUtils.jwtPeAccess(accesstoken);
        String id = new Date().getTime()+"";
        StringBuilder header = new StringBuilder();
        header.append(QUESTION_CONTENT_PATH).append(id).append(".png");
        // 获取文件的类型
        String type = FileTypeUtil.getType(file.getInputStream());
        if(!StringUtils.containsAny(type,"jpg","jpeg","png")){
            // System.out.println("非图片文件");
        }else{
            FileWriter writer = new FileWriter(String.valueOf(header));
            writer.writeFromStream(file.getInputStream());
        }
        return id;
    }

    /**
     * @todo 显示头像
     * @param filename
     * @return
     * @throws IOException
     */
    @GetMapping("/file/userheader/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(USER_HEADER_PATH).resolve(filename).normalize();
        // 读取文件内容
        byte[] imageBytes = Files.readAllBytes(filePath);
        // 设置Content-Type为image/jpeg
        MediaType mediaType = MediaType.IMAGE_JPEG;
        // 构建响应
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(imageBytes);
    }

    /**
     * @todo 显示题目中的图片
     * @param filename
     * @return
     * @throws IOException
     */
    @GetMapping("/file/questionContent/{filename:.+}")
    public ResponseEntity<byte[]> getQuestionContent(@PathVariable String filename) throws IOException {
        Path filePath = Paths.get(QUESTION_CONTENT_PATH).resolve(filename).normalize();
        // 读取文件内容
        byte[] imageBytes = Files.readAllBytes(filePath);
        // 设置Content-Type为image/jpeg
        MediaType mediaType = MediaType.IMAGE_JPEG;
        // 构建响应
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(imageBytes);
    }
}
