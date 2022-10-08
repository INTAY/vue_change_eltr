import request from '../../api/request'


export let uploadUrl = "";
export let modifyUrl = "";
export let picUrl = "";
export let fileName = "";
export let fileType = "";
export let type = "";
export let fileid = "";

// 图片上传路径
export function getPicUrl() {
  uploadUrl = request.uploadUrl();
  modifyUrl = request.modifyUrl();
}

// 图片格式、大小校验
export function beforeUpload(file) {
  let picStyle = /^image\/(jpeg|png|jpg)$/.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!picStyle) {
    this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!');
  }
  if (!isLt2M) {
    this.$message.error('上传文件大小不能超过 2MB!');
  }
  if (file.name.indexOf(".docx") !== -1 || file.name.indexOf(".xlsx") !== -1) {
    fileType = 2;
    type = 2;
  }
  if (file.name.indexOf(".png") !== -1 || file.name.indexOf(".jpg") !== -1) {
    fileType = 1;
    type = 1;
  }
  fileName = file.name;
  return picStyle && isLt2M;
}

// 上传成功操作
export function handleImageSuccess(res, file, fileList) {
  if ("000000" === res.code) {
    picUrl = res.data[0].url;
    fileid = res.data[0].id;
  } else {
    this.$message.error(res.mesg)
  }
}
