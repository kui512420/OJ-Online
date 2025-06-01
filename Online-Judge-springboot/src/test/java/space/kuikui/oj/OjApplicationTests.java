package space.kuikui.oj;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import space.kuikui.oj.common.JwtLoginUtils;
import space.kuikui.oj.judge.codesandbox.CodeSandBox;
import space.kuikui.oj.judge.codesandbox.CodeSandBoxFactory;
import space.kuikui.oj.judge.codesandbox.CodeSandBoxProxy;
import space.kuikui.oj.judge.codesandbox.model.ExecuteCodeRequest;
import space.kuikui.oj.model.entity.User;
import space.kuikui.oj.model.entity.Question;
import space.kuikui.oj.service.RabbitMQProducer;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

@SpringBootTest
class OjApplicationTests {

    @Resource
    private JwtLoginUtils jwtLoginUtils;
    @Resource
    private RabbitMQProducer rabbitMQProducer;

    @Value("${code.default}")
    private String type;

    @Test
    void jwtTest() {
        User user = new User();
        user.setId(423423432L);
        user.setUserAccount("sdasdasdas");
        user.setCreateTime(new Date());
        
        //设token
        String token = jwtLoginUtils.jwtBdAccess(user);
        //校验token
        Map<Object, Object> map = jwtLoginUtils.jwtPeAccess(token);
        System.out.println(map.get("id"));
    }

    @Test
    void codeSandBoxTest() throws IOException, InterruptedException {
        CodeSandBox codeSandBox = CodeSandBoxFactory.newInstance(type);
        codeSandBox = new CodeSandBoxProxy(codeSandBox);
        String code = "";
        List<String> info = Arrays.asList("12 10","1 0");
        
        // 创建一个Question对象，设置judgeCase来避免空指针异常
        Question question = new Question();
        // 设置一个简单的测试用例JSON
        question.setJudgeCase("[{\"input\":\"12 10\",\"output\":\"22\"},{\"input\":\"1 0\",\"output\":\"1\"}]");
        
        ExecuteCodeRequest codeRequest = ExecuteCodeRequest.builder()
                        .code(code)
                        .language("java")
                        .inputList(info)
                        .question(question)
                        .build();
        codeSandBox.executeCode(codeRequest);
    }

}
