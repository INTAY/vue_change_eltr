import JSZip from "jszip";
import { saveAs } from "file-saver";
import $ from 'jquery'
let FunLib = {
    // 图片打包下载
    download: function (images) {
        FunLib.packageImages(images)
    },
    // 打包压缩图片
    packageImages: function (imgs) {
        var imgBase64 = []
        var imageSuffix = [] // 图片后缀
        var zip = new JSZip()
        var img = zip.folder("images")
 
        for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].url
            var suffix = src.substring(src.lastIndexOf("."))
            imageSuffix.push(suffix)
            FunLib.getBase64(imgs[i].url).then(function (base64) {
                imgBase64.push(base64.substring(22))
                if (imgs.length === imgBase64.length) {
                    for (var i = 0; i < imgs.length; i++) {
                        img.file(imgs[i].name + imageSuffix[i], imgBase64[i], {base64: true})
                    }
                    zip.generateAsync({type: "blob"}).then(function (content) {
                        saveAs(content, "images.zip")
                    })
                }
            }, function (err) {
                console.log(err)
            })
        }
    },
    // 传入图片路径，返回base64
    getBase64: function (img) {
        var image = new Image()
        image.crossOrigin = 'Anonymous'
        image.src = img
        var deferred = $.Deferred()
        if (img) {
            image.onload = function () {
                var canvas = document.createElement("canvas")
                canvas.width = image.width
                canvas.height = image.height
                var ctx = canvas.getContext("2d")
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                var dataURL = canvas.toDataURL()
                deferred.resolve(dataURL)
            }
            return deferred.promise()
        }
    }
}
export default FunLib;