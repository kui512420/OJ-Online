import AccessEnum from "./accessEnum"

/**
 *
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @return boolean 返回是否通过权限校验
 */
const cheakAccess = (loginUser:any,needAccess:any)=>{
  const loginUserAccess = loginUser?.userRole??AccessEnum.NOT_LOGIN

  //需要的权限是无需登录，直接返回
  if(needAccess===AccessEnum.NOT_LOGIN){
    return true
  }
  //需要的权限是登录，但是用户未登录，返回false
  if(needAccess===AccessEnum.USER){
    if(loginUserAccess === AccessEnum.NOT_LOGIN){
      return false
    }
  }
  //需要的权限是不是管理员，但是用户不是管理员，返回false
  if(needAccess===AccessEnum.ADMIN){
    if(loginUserAccess !== AccessEnum.ADMIN){
      return false
    }
  }
  return true
}

export default cheakAccess
