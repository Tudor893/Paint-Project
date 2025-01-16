myCanvas = document.getElementById("canvas")
ctx = myCanvas.getContext("2d")

var x = 0, y = 0, w = 0, h = 0, x1 = 0, y1 = 0;
var selectFormRectangle = selectFormLine = selectFormEllipse = 0; 
var defaultOption = document.querySelector("select").value;
var defaultOptionThickness = document.getElementById("selectLine").value;
var draw = false;
var index;
var deleteShapes = false;
var updateShapes = false;
var shapeName = "";
var canvasBackgroundColor = "#ffffff";
var shapeBackgroundColor = "transparent";
var shapeMarginColor = "#000000";
document.getElementById("shapeMarginColor").value = shapeMarginColor;
var lineThickness = 1;
var labelX = document.getElementById("labelX");
var labelY = document.getElementById("labelY");
var labelX1 = document.getElementById("labelX1");
var labelY1 = document.getElementById("labelY1");
var labelW = document.getElementById("labelW");
var labelH = document.getElementById("labelH");
var inputX = document.getElementById("shapeX");
var inputY = document.getElementById("shapeY");
var inputX1 = document.getElementById("shapeX1");
var inputY1 = document.getElementById("shapeY1");
var inputW = document.getElementById("shapeW");
var inputH = document.getElementById("shapeH");
var updateBtnRE = document.getElementById("updateRectEllipse");
var updateBtnL = document.getElementById("updateLine");
var rectangle = {
    type: "rectangle",
    startX: 0,
    startY: 0,
    width: 0,
    height: 0,
    bgColor: shapeBackgroundColor,
    marginColor: shapeMarginColor,
    lineThickness: lineThickness
}
var line = {
    type: "line",
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    marginColor: shapeMarginColor,
    lineThickness: lineThickness
}
var ellipse = {
    type: "ellipse",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    bgColor: shapeBackgroundColor,
    marginColor: shapeMarginColor,
    lineThickness: lineThickness
}
var shapes = [];

document.getElementById("rectangle").addEventListener("click", () => {
    shapeName = "rectangle";
    deleteShapes = false;   
    if(updateShapes){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    }
    updateShapes = false;
})
document.getElementById("ellipse").addEventListener("click", () => {
    shapeName = "ellipse";
    deleteShapes = false; 
    if(updateShapes){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    }
    updateShapes = false; 
})
document.getElementById("line").addEventListener("click", () => {
    shapeName = "line";
    deleteShapes = false;
    if(updateShapes){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    }
    updateShapes = false;
})
document.getElementById("delete").addEventListener("click", () => {
    deleteShapes = true;
    if(updateShapes){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    }
    updateShapes = false;
})
document.getElementById("update").addEventListener("click", () => {
    updateShapes = true;
    deleteShapes = false;
})
document.getElementById("refreshBg").addEventListener("click", () => {
    shapeBackgroundColor = "transparent";
    document.getElementById("shapeBackgroundColor").value = "#ffffff";
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
})
document.getElementById("undo").addEventListener("click", () => {
    let valueName = shapes[shapes.length - 1].type;
    shapes.splice(shapes.length - 1, 1);
    deleteOptionAfterDeleteSingles(valueName);
    drawShapes();
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
})
document.getElementById("reset").addEventListener("click", () => {
    shapes = [];
    x = y = w = h = x1 = y1 = 0;
    shapeName = "";
    canvasBackgroundColor = "#ffffff";
    shapeBackgroundColor = "transparent";
    myCanvas.style.backgroundColor = canvasBackgroundColor;
    shapeMarginColor = "#000000";
    lineThickness = 1;
    draw = false;
    selectFormRectangle = selectFormLine = selectFormEllipse = 0;
    document.getElementById("canvasColor").value = "#ffffff";
    document.getElementById("shapeBackgroundColor").value = "#ffffff";
    document.getElementById("shapeMarginColor").value = "#000000";
    document.getElementById("selectLine").value = defaultOptionThickness;
    drawShapes();
    deleteOptionAfterDeleteSingles("rectangle");
    deleteOptionAfterDeleteSingles("line");
    deleteOptionAfterDeleteSingles("ellipse");
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
})
document.getElementById("savePNG").addEventListener("click", () => {
    let imgCanvas = myCanvas.toDataURL("image/png");
    let link = document.createElement("a");
    link.download = "saved_canvas.png";
    link.href = imgCanvas;
    link.click();
    updateShapes = deleteShapes = false;
})
myCanvas.addEventListener("mousedown", (e) => {
    if(!deleteShapes && !updateShapes){
        x = e.clientX - myCanvas.getBoundingClientRect().left;
        y = e.clientY - myCanvas.getBoundingClientRect().top;
        draw = true;
    }
})

function drawRectangle(x, y, w, h, bgColor, marginColor, lineWidth){
    ctx.beginPath();
    ctx.strokeStyle = marginColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, w, h);
    ctx.stroke();
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);
}

function drawLine(x, y, x1, y1, marginColor, lineWidth){
    if(x1 != 0 && y1 != 0){
        ctx.beginPath();
        ctx.strokeStyle = marginColor;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
}

function drawEllipse(x, y, w, h, bgColor, marginColor, lineWidth){
    ctx.beginPath();
    ctx.fillStyle = bgColor;
    ctx.strokeStyle = marginColor;
    ctx.lineWidth = lineWidth;
    ctx.ellipse(x + w/2, y + h/2, Math.abs(w/2), Math.abs(h/2), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

myCanvas.addEventListener("mousemove", (e) => {
    if(draw){
        x1 = e.clientX - myCanvas.getBoundingClientRect().left;
        y1 = e.clientY - myCanvas.getBoundingClientRect().top;
        w = x1 - x;
        h = y1 - y;
        drawShapes();
        if(shapeName === "rectangle"){
            drawRectangle(x, y, w, h, shapeBackgroundColor, shapeMarginColor, lineThickness);
        }else if(shapeName === "line"){
            drawLine(x, y, x1, y1, shapeMarginColor, lineThickness);
        }else if(shapeName === "ellipse"){
            drawEllipse(x, y, w, h, shapeBackgroundColor, shapeMarginColor, lineThickness);
        }
    }
})

myCanvas.addEventListener("mouseup", () => {
    draw = false;
    if(shapeName === "rectangle" && x !== 0 && y !== 0 && w !== 0 && h !== 0){
        shapes.push({type: shapeName, startX: x, startY: y, width: w, height: h, bgColor: shapeBackgroundColor, marginColor: shapeMarginColor, lineThickness: lineThickness});
        if(selectFormRectangle === 0){
            addOptionToSelectForm(shapeName);
            selectFormRectangle = 1;
        }
    }else if(shapeName === "line" && x !== 0 && y !== 0 && x1 !== 0 && y1 !== 0){
        shapes.push({type: shapeName, startX: x, startY: y, endX: x1, endY: y1, marginColor: shapeMarginColor, lineThickness: lineThickness});
        if(selectFormLine === 0){
            addOptionToSelectForm(shapeName);
            selectFormLine = 1;
        }
    }else if(shapeName === "ellipse" && x !== 0 && y !== 0 && w !== 0 && h !== 0){
        shapes.push({type: shapeName, x: x, y: y, width: w, height: h, bgColor: shapeBackgroundColor, marginColor: shapeMarginColor, lineThickness: lineThickness});
        if(selectFormEllipse === 0){
            addOptionToSelectForm(shapeName);
            selectFormEllipse = 1;
        }
    }
    x = y = w = h = x1 = y1 = 0;
    drawShapes();
})

function addOptionToSelectForm(shapeName){
    let select = document.getElementById("selectShape");
    let option = document.createElement("option");
    option.textContent = shapeName;
    select.appendChild(option);
}

function drawShapes(){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    for(let shape of shapes){
        if(shape.type === "rectangle"){
            drawRectangle(shape.startX, shape.startY, shape.width, shape.height, shape.bgColor, shape.marginColor, shape.lineThickness);
        }else 
            if(shape.type === "line"){
                drawLine(shape.startX, shape.startY, shape.endX, shape.endY, shape.marginColor, shape.lineThickness);
            }
            else 
                if(shape.type == "ellipse"){
                    drawEllipse(shape.x, shape.y, shape.width, shape.height, shape.bgColor, shape.marginColor, shape.lineThickness);
                }
    }
}

myCanvas.addEventListener("click", (e) => {
    if(deleteShapes){    
        let clickX = e.clientX - myCanvas.getBoundingClientRect().left;
        let clickY = e.clientY - myCanvas.getBoundingClientRect().top;
        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].type === "rectangle" && checkRectangle(shapes[i], clickX, clickY)){
                    let name = shapes[i].type;
                    shapes.splice(i, 1);
                    deleteOptionAfterDeleteSingles(name);
                    break;
            }
            else if(shapes[i].type === "line" && checkLine(shapes[i], clickX, clickY)){
                let name = shapes[i].type;
                shapes.splice(i, 1);
                deleteOptionAfterDeleteSingles(name);
                break;
            }
            else if(shapes[i].type === "ellipse" && checkEllipse(shapes[i], clickX, clickY)){
                let name = shapes[i].type;
                shapes.splice(i, 1);
                deleteOptionAfterDeleteSingles(name);
                break;
            }
        }
        drawShapes();
    } 
})

myCanvas.addEventListener("click", (e) => {
    if(updateShapes){
        let clickX = e.clientX - myCanvas.getBoundingClientRect().left;
        let clickY = e.clientY - myCanvas.getBoundingClientRect().top;
        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].type === "rectangle" && checkRectangle(shapes[i], clickX, clickY)){
                showInputs(shapes[i].type, i);
                break;
            }
            else if(shapes[i].type === "line" && checkLine(shapes[i], clickX, clickY)){
                showInputs(shapes[i].type, i);
                break;
            }
            else if(shapes[i].type === "ellipse" && checkEllipse(shapes[i], clickX, clickY)){
                showInputs(shapes[i].type, i);
                break;
            }
        }
    }
})

document.getElementById("updateRectEllipse").addEventListener("click", () => {
    let newX = parseFloat(inputX.value);
    let newY = parseFloat(inputY.value);
    let newW = parseFloat(inputW.value);
    let newH = parseFloat(inputH.value);
    if(shapes[index].type === "rectangle"){
        shapes[index].startX = newX;
        shapes[index].startY = newY;
        shapes[index].width = newW;
        shapes[index].height = newH;
    }
    if(shapes[index].type === "ellipse"){
        shapes[index].x = newX;
        shapes[index].y = newY;
        shapes[index].width = newW;
        shapes[index].height = newH;
    }
    drawShapes();
    if(updateShapes){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    }
    updateShapes = false;
})

document.getElementById("updateLine").addEventListener("click", () => {
    let newX = parseFloat(inputX.value);
    let newY = parseFloat(inputY.value);
    let newX1 = parseFloat(inputX1.value);
    let newY1 = parseFloat(inputY1.value);
    shapes[index].startX = newX;
    shapes[index].startY = newY;
    shapes[index].endX = newX1;
    shapes[index].endY = newY1;
    drawShapes();
    if(updateShapes){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    }
    updateShapes = false;
})

function showInputs(name, i){
    index = i;
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    if(name === "rectangle"){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = false;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = false;
        updateBtnRE.hidden = false;
        inputX.value = shapes[i].startX;
        inputY.value = shapes[i].startY;
        inputW.value = shapes[i].width;
        inputH.value = shapes[i].height;
    }else if(name === "ellipse"){
        labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = false;
        inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = false;
        updateBtnRE.hidden = false;
        inputX.value = shapes[i].x;
        inputY.value = shapes[i].y;
        inputW.value = shapes[i].width;
        inputH.value = shapes[i].height;
    }else if(name === "line"){
        labelX.hidden = labelY.hidden = labelX1.hidden = labelY1.hidden = false;
        inputX.hidden = inputY.hidden = inputX1.hidden = inputY1.hidden = false;
        updateBtnL.hidden = false;
        inputX.value = shapes[i].startX;
        inputY.value = shapes[i].startY;
        inputX1.value = shapes[i].endX;
        inputY1.value = shapes[i].endY;
    }
}

function checkLine(shape, clickX, clickY){
    let a = shape.endY - shape.startY;
    let b = shape.startX - shape.endX;
    let c = shape.startY * shape.endX - shape.startX * shape.endY;
    let distance = Math.abs(a * clickX + b * clickY + c) / Math.sqrt(a * a + b * b);
    if(distance <= 4)
        return true;
    return false;
}

function checkEllipse(shape, clickX, clickY){
    let eq1 = Math.pow(clickX - (shape.x + shape.width/2), 2) / (Math.abs(shape.width/2) * Math.abs(shape.width/2));
    let eq2 = Math.pow(clickY - (shape.y + shape.height/2), 2) / (Math.abs(shape.height/2) * Math.abs(shape.height/2));
    let sum = eq1 + eq2;
    if(sum <= 1)
        return true;
    return false;
}

function checkRectangle(shape, clickX, clickY){
    if(shape.startX + shape.width >= clickX && shape.startX <= clickX &&
        ((shape.startY + shape.height >= clickY && shape.startY <= clickY) ||
        (shape.startY - shape.height <= clickX && shape.startY >= clickY)))
            return true;
    if(shape.startX + shape.width <= clickX && shape.startX >= clickX && 
        ((shape.startY + shape.height >= clickY && shape.startY <= clickY) ||
        (shape.startY - shape.height >= clickY && shape.startY >= clickY)))
            return true;
    return false;
}

function deleteOptionAfterDeleteAll(){
    let option = document.getElementById("selectShape");
    index = option.selectedIndex;
    let shapeSelected = option.value;
    document.getElementById("selectShape").value = defaultOption;
    shapes = shapes.filter(shape => shape.type !== shapeSelected);
    drawShapes();
    option.remove(index);
    if(shapeSelected === "rectangle"){
        selectFormRectangle = 0;
    }else if(shapeSelected === "line"){
        selectFormLine = 0;
    }else if(shapeSelected === "ellipse"){
        selectFormEllipse = 0;
    }
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
}

function deleteOptionAfterDeleteSingles(shapeName){
    let option = document.getElementById("selectShape");
    let optionShape;
    for(let i = 1; i < option.length; i++){
        optionShape = option.options[i].value;
        let count = 0;
        for(let shape of shapes){
            if(shape.type === optionShape){
                count++;
            }
        }
        if(count === 0) {
            option.remove(i);
            if(shapeName === "rectangle"){
                selectFormRectangle = 0;
            }else if(shapeName === "line"){
                selectFormLine = 0;
            }else if(shapeName === "ellipse"){
                selectFormEllipse = 0;
            }
        }
    }
}

function getCanvasColor(){
    canvasBackgroundColor = document.getElementById("canvasColor").value;
    myCanvas.style.backgroundColor = canvasBackgroundColor;
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
}

function getShapeBackgroundColor(){
    shapeBackgroundColor = document.getElementById("shapeBackgroundColor").value;
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
}

function getShapeMarginColor(){
    shapeMarginColor = document.getElementById("shapeMarginColor").value;
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
}

function getLineThickness(){
    lineThickness = document.getElementById("selectLine").value;
    labelX.hidden = labelY.hidden = labelW.hidden = labelH.hidden = labelX1.hidden = labelY1.hidden = updateBtnRE.hidden = updateBtnL.hidden = true;
    inputX.hidden = inputY.hidden = inputW.hidden = inputH.hidden = inputX1.hidden = inputY1.hidden = true;
    updateShapes = false;
}
