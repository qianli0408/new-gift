var musicing = true,
    obox = document.getElementById('box'),
    degree = 1,
    angle = 0,
    autoRotateTimer = 0,
    a = 0,
    aDiv = obox.getElementsByTagName('div');
const big_img = document.getElementById('light'),
    image = document.getElementById('music'),
    mp3 = document.getElementById('audio'),
    modal = document.getElementById('modal'),
    music = document.getElementById("music");

// 旋转相册
document.getElementById('modal').addEventListener('click', function () {
    const glassDiv = this;

    // 获取玻璃元素的位置和大小
    const rect = glassDiv.getBoundingClientRect();

    // 创建多个碎片
    for (let i = 0; i < 180; i++) {
        const shard = document.createElement('div');
        shard.className = 'heart';
        shard.classList.add('shard');

        // 随机位置和旋转角度
        const x = Math.random() * rect.width + rect.left;
        const y = Math.random() * rect.height + rect.top;
        const size = Math.random() * 20 + 100;
        const angle = Math.random() * 360;

        shard.style.left = `${x}px`;
        shard.style.top = `${y}px`;
        shard.style.width = `${size}px`;
        shard.style.height = `${size}px`;

        shard.style.transform = `rotate(${angle}deg)`;

        // 添加到body中
        document.body.appendChild(shard);

        // 应用动画
        shard.style.animation = 'shatter 4s forwards';
    }

    // 设置定时器来控制玻璃元素的透明度变化和最终移除
    setTimeout(() => {
        glassDiv.style.opacity = '0';
        setTimeout(() => {
            glassDiv.remove();
            // 移除所有碎片
            const shards = document.querySelectorAll('.shard');
            shards.forEach(shard => shard.remove());
        }, 1000);
    }, 10);
});

var rotationAngleX = -10; // 初始旋转角度X
var rotationAngleY = 0;  // 初始旋转角度Y
var autoRotateId = null; // 用于存储 requestAnimationFrame 的 ID

function autoRotate() {
    rotationAngleY += 0.1; // 每帧旋转0.5度
    obox.style.transform = `rotateX(${rotationAngleX}deg) rotateY(${rotationAngleY % 360}deg)`;
    autoRotateId = requestAnimationFrame(autoRotate);
}

function start() {
    mp3.play();
    circleMusic();
    mp3.muted = false;
    setTimeout(picture, 1200);
}

function getRotation(element) {
    const style = window.getComputedStyle(element);
    const transform = style.getPropertyValue('transform');
    // 如果没有应用任何变换，则返回默认值
    if (transform === 'none') {
        return { rotateX: 0, rotateY: 0 };
    }
    // 解析矩阵
    const matrix = new DOMMatrix(transform);
    // 对于3D变换，可以使用matrix.m12, matrix.m13, matrix.m21, matrix.m23, matrix.m31, matrix.m32来计算角度。
    // 这里我们假设只应用了rotateX和rotateY，没有其他复杂的变换。
    let rotateX = Math.asin(-matrix.m32) * (180 / Math.PI); // 获取rotateX的角度，单位转换为度
    let rotateY = Math.asin(matrix.m31) * (180 / Math.PI);  // 获取rotateY的角度，单位转换为度
    // 处理四象限问题
    if (Math.abs(rotateX) > 90) {
        rotateY = (Math.PI - Math.abs(rotateY)) * Math.sign(rotateY) * (180 / Math.PI);
    }
    if (Math.abs(rotateY) > 90) {
        rotateX = (Math.PI - Math.abs(rotateX)) * Math.sign(rotateX) * (180 / Math.PI);
    }
    return { rotateX, rotateY };
}

function picture() {
    for (var i = 0; i < aDiv.length; i++) {
        aDiv[i].style.background = "url(./assets/images/" + (i + 1) + ".jpg) center/cover";
        aDiv[i].style.transform = "rotateY(" + (i * 36) + "deg) translate3d(0,0,250px)";
        aDiv[i].style.transition = "transform 1s " + (aDiv.length - i) * 0.2 + "s";
    }
    var sX,
        sY,
        nX,
        nY,
        desX = 0,
        desY = 0,
        tX = 0,
        tY = 0,
        index = 0; // 滚轮初始值

    function startDrag(e) {
        clearInterval(obox.timer);
        // 停止自动旋转
        cancelAnimationFrame(autoRotateId);

        // 添加触摸反馈效果
        obox.style.transform = "scale(0.95) rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
        obox.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
        obox.style.backgroundColor = "rgba(255, 255, 255, 0.1)";

        var touch = e.touches ? e.touches[0] : e; // 获取触摸点或鼠标事件
        var sX = touch.clientX,
            sY = touch.clientY;

        function moveHandler(e) {
            if (e.cancelable) { // 检查事件是否可取消
                e.preventDefault(); // 阻止默认行为，比如滚动
            }
            var touchMove = e.touches ? e.touches[0] : e;
            var nX = touchMove.clientX,
                nY = touchMove.clientY;
            desX = nX - sX;
            desY = nY - sY;
            tX += desX * 0.1;
            tY += desY * 0.1;
            obox.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
            sX = nX;
            sY = nY;
        }

        function endHandler() {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', endHandler);
            document.removeEventListener('touchmove', moveHandler, { passive: false });
            document.removeEventListener('touchend', endHandler);

            // 恢复触摸反馈效果
            obox.style.transform = "scale(1) rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
            obox.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            obox.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

            obox.timer = setInterval(function () {
                desX *= 0.95;
                desY *= 0.95;
                tX += desX * 0.1;
                tY += desY * 0.1;
                obox.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
                if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                    clearInterval(obox.timer);
                    rotationAngleX = -tY; // 更新 rotationAngleX
                    rotationAngleY = tX;  // 更新 rotationAngleY
                }
            }, 13);
        }

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);

        // 添加鼠标和触摸的开始事件监听器
        document.addEventListener('mousedown', startDrag);
        document.addEventListener('touchstart', startDrag, { passive: false });
    }

    // 添加鼠标和触摸的开始事件监听器
    document.addEventListener('mousedown', startDrag);
    document.addEventListener('touchstart', startDrag);

    // 滚轮放大缩小
    mousewheel(document, function (e) {
        e = e || window.event;
        var d = e.wheelDelta / 120 || -e.detail / 3;
        if (d > 0) {
            index -= 20;
        } else {
            index += 30;
        }
        (index < (-1050) && (index = (-1050)));
        document.body.style.perspective = 1000 + index + "px";
    })

    function mousewheel(obj, fn) {
        obj.addEventListener('wheel', fn, { passive: false });
    }

    function addEvent(obj, eName, fn) {
        obj.addEventListener(eName, fn, { passive: false });
    }
}

function display_bigImg(image) {
    // 获取背景图片路径
    const bgImage = window.getComputedStyle(image).backgroundImage;
    const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (urlMatch && urlMatch[1]) {
        big_img.style.backgroundImage = `url(${urlMatch[1]})`;
        big_img.style.display = 'block';
    } else {
        console.error('Background image URL not found:', bgImage);
    }
}

function display_smallImg() {
    document.getElementById('light').style.display = 'none';
}

function circleMusic() {
    if (!musicing) {
        return;
    } else {
        cir = setInterval(() => {
            angle += 1;
            image.style.transform = `rotate(${angle}deg)`;
        }, 10);
    }
}

function changeMusic() {

    if (!musicing) {
        music.src = './assets/images/music.png';
        mp3.play();
        mp3.muted = false;
        musicing = true;
        circleMusic(); cancelAnimationFrame(autoRotateId);
        // if (musicing) {
        //     autoRotate(); // 启动自动旋转
        // }
    } else {
        music.src = './assets/images/nomusic.png';
        clearInterval(cir);
        mp3.pause();
        musicing = false;
        // cancelAnimationFrame(autoRotateId); // 停止自动旋转
    }
}