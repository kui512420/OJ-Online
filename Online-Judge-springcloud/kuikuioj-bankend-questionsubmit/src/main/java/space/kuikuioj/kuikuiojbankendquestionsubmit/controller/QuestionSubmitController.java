package space.kuikuioj.kuikuiojbankendquestionsubmit.controller;

import cn.hutool.core.io.FileUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.annotation.Resource;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import space.kuikuioj.kuikuiojbankendcommon.back.BaseResponse;
import space.kuikuioj.kuikuiojbankendcommon.back.ResultUtils;
import space.kuikuioj.kuikuiojbankendcommon.utils.JwtLoginUtils;
import space.kuikuioj.kuikuiojbankendmodel.dto.SubmitListRequest;
import space.kuikuioj.kuikuiojbankendmodel.dto.SubmitRankRequest;
import space.kuikuioj.kuikuiojbankendmodel.dto.SubmitRequest;
import space.kuikuioj.kuikuiojbankendmodel.dto.UserCommitRequest;
import space.kuikuioj.kuikuiojbankendmodel.entity.QuestionSubmit;
import space.kuikuioj.kuikuiojbankendquestionsubmit.service.QuestionSubmitService;


import java.io.File;

/**
 * @author kuikui
 * @date 2025/4/10 23:31
 */
@RestController
public class QuestionSubmitController {

    @Resource
    private QuestionSubmitService questionSubmitService;
    @Resource
    private JwtLoginUtils jwtLoginUtils;

    private static final String TEMP_PATH = System.getProperty("user.dir") + File.separator + "temp";
    
    /**
     * 初始化方法，确保必要的目录存在
     */
    @PostConstruct
    public void init() {
        // 确保临时目录存在
        if (!FileUtil.exist(TEMP_PATH)) {
            FileUtil.mkdir(TEMP_PATH);
        }
    }
    
    /**
     * 提交检测代码
     * @param submitRequest
     * @param token
     * @return
     * @throws JsonProcessingException
     */
    @PostMapping("/sub")
    public BaseResponse<String> submitQuestion(@RequestBody SubmitRequest submitRequest, @RequestHeader(value = "Accesstoken",required = false) String token) throws JsonProcessingException {
        // 确保临时目录存在
        if (!FileUtil.exist(TEMP_PATH)) {
            FileUtil.mkdir(TEMP_PATH);
        }
        
        Long id = null;
        String userName = "";
        try {
            // 提交者的 id 和 名称
            id = Long.valueOf((String) jwtLoginUtils.jwtPeAccess(token).get("id")) ;
            userName = (String) jwtLoginUtils.jwtPeAccess(token).get("userName");
        }catch (Exception e) {
            e.printStackTrace();
        }
        submitRequest.setUserId(id);
        submitRequest.setUserName(userName);
        // 保存 用户提交的信息
        Long subId = questionSubmitService.submit(submitRequest);
        submitRequest.setId(subId);

        return ResultUtils.success("提交成功","");
    }

    /**
     * 获取 代码沙箱执行后的列表
     * @param submitListRequest
     * @param token
     * @return
     */
    @PostMapping("/list")
    public BaseResponse<Page<QuestionSubmit>> submitQuestionList(@RequestBody SubmitListRequest submitListRequest, @RequestHeader(value = "Accesstoken",required = false) String token) {
        Long id = null;
        try {
            id = Long.valueOf((String) jwtLoginUtils.jwtPeAccess(token).get("id")) ;
        }catch (Exception e) {
            e.printStackTrace();
        }
        submitListRequest.setUserId(id);
        Page<QuestionSubmit> questionSubmitPage = questionSubmitService.list(submitListRequest);
        return ResultUtils.success("获取成功",questionSubmitPage);
    }

    /**
     * 获取 代码沙箱执行后的列表
     * @param submitRankRequest
     * @return
     */
    @PostMapping("/rank")
    public BaseResponse<Page<QuestionSubmit>> submitQuestionRankList(@RequestBody SubmitRankRequest submitRankRequest) {

        Page<QuestionSubmit> questionSubmitPage = questionSubmitService.rank(submitRankRequest);
        return ResultUtils.success("获取成功",questionSubmitPage);
    }

    /**
     * 获取用户提交信息统计
     * @param token
     * @return
     */
    @GetMapping("/userCommitInfo")
    public BaseResponse<UserCommitRequest> userCommitInfo(@RequestHeader(value = "Accesstoken",required = false) String token) {
        Long userId = null;
        try {
            userId = Long.valueOf((String) jwtLoginUtils.jwtPeAccess(token).get("id"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (userId == null) {
            return ResultUtils.error(401, "用户未登录", null);
        }
        UserCommitRequest userCommitRequest = questionSubmitService.userCommitInfo(userId);
        return ResultUtils.success("获取成功", userCommitRequest);
    }

    /**
     * 定时任务：每半个小时删除代码文件
     *
     */
    @Scheduled(cron = "0 */30 * * * ?")
    public void updateCompetitionStatus() {
        FileUtil.del(TEMP_PATH);
    }

    /**
     * 获取用户的所有提交记录（分页）
     * @param pageNum 页码，默认为1
     * @param pageSize 每页记录数，默认为10
     * @param token 用户令牌
     * @return 分页后的用户提交记录列表
     */
    @GetMapping("/user/all")
    public BaseResponse<Page<QuestionSubmit>> getAllUserSubmissions(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestHeader(value = "Accesstoken", required = false) String token) {
        // System.out.println(666);
        Long userId = null;
        try {
            userId = Long.valueOf((String) jwtLoginUtils.jwtPeAccess(token).get("id"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        Page<QuestionSubmit> submissionsPage = questionSubmitService.getAllUserSubmissions(userId, pageNum, pageSize);
        return ResultUtils.success("获取成功", submissionsPage);
    }
}
