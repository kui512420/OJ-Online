  // 交卷按钮点击处理
  const handleSubmitPaper = async () => {
    try {
      loading.value = true;
      const confirmResult = await ElMessageBox.confirm(
        '确定要交卷吗？交卷后将不能再修改答案。', 
        '交卷确认',
        {
          confirmButtonText: '确定交卷',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );
      
      if (confirmResult === 'confirm') {
        // 获取localStorage中存储的代码
        const submissionKey = `competition_submission_${route.params.id}`;
        const savedData = localStorage.getItem(submissionKey);
        
        if (savedData) {
          // 解析存储的代码数据
          const parsedData = JSON.parse(savedData);
          
          // 发送请求，包含用户的代码数据
          const res = await competitionControllerSubmitPaper(
            route.params.id as string,
            undefined,
            parsedData
          );
          
          if (res.code === 0) {
            ElMessage.success('交卷成功！');
            // 刷新排行榜
            await getLeaderboard();
            // 禁用交卷按钮
            isSubmitted.value = true;
          } else {
            ElMessage.error(res.message || '交卷失败');
          }
        } else {
          // 没有找到存储的代码数据，直接调用交卷API
          const res = await competitionControllerSubmitPaper(route.params.id as string);
          if (res.code === 0) {
            ElMessage.success('交卷成功！');
            // 刷新排行榜
            await getLeaderboard();
            // 禁用交卷按钮
            isSubmitted.value = true;
          } else {
            ElMessage.error(res.message || '交卷失败');
          }
        }
      }
    } catch (error: any) {
      if (error?.message !== 'cancel') {
        ElMessage.error('交卷失败: ' + (error?.message || '未知错误'));
      }
    } finally {
      loading.value = false;
    }
  }; 