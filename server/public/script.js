fabric.Object.prototype.set({
  cornerBackground: "red",
  cornerSize: 200,
  cornerStrokeWidth: 200, // Width of the stroke around the controls
  transparentCorners: false,
  selectable: true,
});

const canvas = new fabric.Canvas("canvas", {
  preserveObjectStacking: true,
  enableRetinaScaling: false,
});
const canvas2 = new fabric.Canvas("canvas2", {
  preserveObjectStacking: true,
  enableRetinaScaling: false,
});
const exportCanvas = new fabric.Canvas("exportCanvas", {
  preserveObjectStacking: true,
  enableRetinaScaling: false,
});

let selectedObject = null;
let currentImageUrl = null; // variable to store the URL of the current image

$(".fa-bars").click(function (params) {
  $("#sidebar-canvas-one").toggle();
  $("#sidebar-canvas-one").css("width", "100%");
});

$(".cross-icon").click(function (params) {
  $("#sidebar-canvas-one").hide();
});

function inputChange(selector, canvas, container) {
  document.querySelector(selector).addEventListener("change", (event) => {
    const file = event.target.files[0];
    currentImageUrl = URL.createObjectURL(file); // update the current image URL
    const imgNode = new Image();
    imgNode.src = currentImageUrl;
    imgNode.onload = () => {
      const img = new fabric.Image(imgNode, {
        angle: 0,
        opacity: 1,
      });
      const MAX_SIZE = 2000;
      const scaleFactor = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = img.height * scaleFactor;

      img.set({
        left: canvas.width / 2 - scaledWidth / 2,
        top: canvas.height / 2 - scaledHeight / 2,
      });

      canvas.add(img);
      createImagePreview(currentImageUrl, img, canvas, container);
      input.value = ""; // Clear the input field
    };
  });
}

inputChange("#input", canvas, "#image-preview-container");
inputChange("#input2", canvas2, "#image-preview-container2");

function cambiarColorRojo(btnId) {
  // Obtener todos los botones
  const botones = document.querySelectorAll("button");

  // Restaurar el color original de todos los botones
  botones.forEach((boton) => {
    boton.style.backgroundColor = "";
  });

  // Obtener el elemento del botón
  const boton = document.getElementById(btnId);

  // Cambiar el color a rojo
  boton.style.backgroundColor = "red";
}

window.onload = function () {
  cambiarColorRojo("holaBtn");
};

// Asignar el evento de clic al botón "Hola"
document.getElementById("holaBtn").addEventListener("click", function () {
  // Cambiar el color del botón a rojo y restaurar otros colores
  cambiarColorRojo("holaBtn");
});

// Asignar el evento de clic al botón "Adiós"
document.getElementById("adiosBtn").addEventListener("click", function () {
  // Cambiar el color del botón a rojo y restaurar otros colores
  cambiarColorRojo("adiosBtn");
});

// Function to toggle visibility of canvases
function toggleCanvasVisibility(
  canvasToShow,
  canvasToHide,
  parentToShow,
  parentToHide
) {
  document.querySelector(
    parentToShow
  ).parentElement.parentElement.style.display = "block";
  document.querySelector(
    parentToHide
  ).parentElement.parentElement.style.display = "none";

  canvasToShow.lowerCanvasEl.style.display = "block";
  canvasToShow.upperCanvasEl.style.display = "block";

  // Show the selected canvas
  canvasToHide.lowerCanvasEl.style.display = "none";
  canvasToHide.upperCanvasEl.style.display = "none";
}

// Event listener for "Canvas1" button
document.getElementById("holaBtn").addEventListener("click", function () {
  toggleCanvasVisibility(canvas, canvas2, "#canvas", "#canvas2");
  $("#sidebar-canvas-two").hide();
  $("#sidebar-canvas-one").show();
});

// Event listener for "Canvas2" button
document.getElementById("adiosBtn").addEventListener("click", function () {
  toggleCanvasVisibility(canvas2, canvas, "#canvas2", "#canvas");
  $("#sidebar-canvas-one").hide();
  $("#sidebar-canvas-two").show();
});

// Set the initial visibility (e.g., show canvas1 and hide canvas2)
toggleCanvasVisibility(canvas, canvas2, "#canvas", "#canvas2");
toggleCanvasVisibility(canvas, exportCanvas, "#canvas", "#exportCanvas");
$("#sidebar-canvas-two").hide();

// Function to delete both the Fabric object and the image preview
function deleteImage(fabricID) {
  const fabricObject = canvas
    .getObjects()
    .find((obj) => obj.get("fabricID") === fabricID);
  const fabricObject2 = canvas2
    .getObjects()
    .find((obj) => obj.get("fabricID") === fabricID);
  if (fabricObject) {
    // Remove the image preview and the corresponding image in the canvas
    // fabricObject.remove();
    canvas.remove(fabricObject);
    const previewContainer = document.getElementById(fabricID);
    if (previewContainer) {
      previewContainer.remove();
    }
  } else if (fabricObject2) {
    // Remove the image preview and the corresponding image in the canvas
    // fabricObject.remove();
    canvas2.remove(fabricObject2);
    const previewContainer = document.getElementById(fabricID);
    if (previewContainer) {
      previewContainer.remove();
    }
  }
}

function createImagePreview(imageUrl, imageObject, canvas, container) {
  // Create a new image preview and delete button
  const previewContainer = document.createElement("div");
  previewContainer.className = "image-icon-container";
  previewContainer.id = `fabric_${Date.now()}`;
  const zIndex = canvas.getObjects().length; // Use the current number of objects as the z-index
  imageObject.set("zIndex", -zIndex);

  const fabricID = `fabric_${Date.now()}`;
  imageObject.set("fabricID", fabricID);
  console.log(imageObject);
  console.log(canvas);

  const template = `
<img src="${imageUrl}" draggable="false">
<div class="buttons-div">
    <div onclick="deleteImage('${fabricID}')" title="Trash">
        <i class="fa-solid fa-trash delete-icon"></i>
    </div>
    <div title="Move">
        <i class="fa-solid fa-grip move-icon"></i>
    </div>
</div>
`;

  previewContainer.innerHTML = template;

  // Insert the new child on top of existing children
  const imagePreviewContainer = document.querySelector(container);
  imagePreviewContainer.insertBefore(
    previewContainer,
    imagePreviewContainer.firstChild
  );
}

canvas.on("mouse:down", (event) => {
  if (event.target) {
    selectedObject = event.target;
  } else {
    selectedObject = null;
  }
});

canvas2.on("mouse:down", (event) => {
  if (event.target) {
    selectedObject = event.target;
  } else {
    selectedObject = null;
  }
});

function addText(textbox, canvas, container) {
  document.querySelector(textbox).addEventListener("click", () => {
    const text = new fabric.IText("Edit your text", {
      left: 100,
      top: 100,
      width: 200, // Set a specific width for the text box
      height: 100, // Set a specific height for the text box
      fontFamily: "Arial",
      fontSize: 20,
      fill: "black",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
    });
    const fabricID = `fabric_${Date.now()}`;

    canvas.add(text);
    text.set("fabricID", fabricID);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    createTextPreview(text, container);
  });
}

addText("#addTextBtn", canvas, ".text-container");
addText("#addTextBtn2", canvas2, ".text-container-2");

// Function to delete the text preview and the corresponding text object
function deleteTextPreview(fabricID) {
  const textPreviewContainer = document.getElementById(`fabric_${fabricID}`);
  if (textPreviewContainer) {
    textPreviewContainer.remove();

    // Find the Fabric object based on the fabricID
    const textObject = canvas
      .getObjects()
      .find((obj) => obj.get("fabricID") === fabricID);
    const textObject2 = canvas2
      .getObjects()
      .find((obj) => obj.get("fabricID") === fabricID);

    if (textObject) {
      // Remove the text object from the canvas
      canvas.remove(textObject);
      canvas.renderAll();
    } else if (textObject2) {
      canvas2.remove(textObject2);
      canvas2.renderAll();
    }
  }
}

// Function to handle text style changes
function setTextStyles(property, value, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set(property, value);
    canvas.requestRenderAll();
  }
}

// Function to toggle text styles
function toggleTextStyles(property, value, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    if (activeObject.get(property) === value) {
      activeObject.set(property, "normal");
    } else {
      activeObject.set(property, value);
    }
    canvas.requestRenderAll();
  }
}

// Example for toggling bold style on button click
function boldBtn(selector, canvas) {
  document.getElementById(selector).addEventListener("click", () => {
    toggleTextStyles("fontWeight", "bold", canvas);
    const activeObject = canvas.getActiveObject().fabricID;
    updateTextPreview(activeObject, canvas);
  });
}

boldBtn("boldBtn", canvas);
boldBtn("boldBtn2", canvas2);

function italicBtn(selector, canvas) {
  // Example for toggling italic style on button click
  document.getElementById(selector).addEventListener("click", () => {
    toggleTextStyles("fontStyle", "italic", canvas);
    const activeObject = canvas.getActiveObject().fabricID;
    updateTextPreview(activeObject, canvas);
  });
}

italicBtn("italicBtn", canvas);
italicBtn("italicBtn2", canvas2);

function alignLeftText(selector, canvas) {
  // Example of changing text alignment to center on button click
  document.getElementById(selector).addEventListener("click", () => {
    setTextStyles("textAlign", "left", canvas);
  });
}

function alignCenterText(selector, canvas) {
  // Example of changing text alignment to center on button click
  document.getElementById(selector).addEventListener("click", () => {
    setTextStyles("textAlign", "center", canvas);
  });
}

function alignRightText(selector, canvas) {
  // Example of changing text alignment to center on button click
  document.getElementById(selector).addEventListener("click", () => {
    setTextStyles("textAlign", "right", canvas);
  });
}
alignLeftText("alignLeftBtn", canvas);
alignLeftText("alignLeftBtn2", canvas2);
alignCenterText("alignCenterBtn", canvas);
alignCenterText("alignCenterBtn2", canvas2);
alignRightText("alignRightBtn", canvas);
alignRightText("alignRightBtn2", canvas2);

// Function to handle the visibility of text-related buttons
function toggleTextButtonsVisibility(isVisible) {
  const textButtons = [
    "boldBtn",
    "boldBtn2",
    "italicBtn",
    "italicBtn2",
    "alignLeftBtn",
    "alignLeftBtn2",
    "alignCenterBtn",
    "alignCenterBtn2",
    "alignRightBtn",
    "alignRightBtn2",
    "fontSizeInput",
    "fontSizeInput2",
    "colorPicker",
    "colorPicker2",
    "fontFamilySelect",
    "fontFamilySelect2",
    "fontFamilylabel",
    "fontFamilylabel2",
    "color-label",
    "color-label2",
    "fontsize-label",
    "fontsize-label2",
    "text-preview",
    "text-preview2",
    "textbox",
    "textbox2",
  ];

  textButtons.forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    button.style.display = isVisible ? "inline-block" : "none";
  });
}

function canvasEvents(canvas) {
  canvas.on("selection:created", function (event) {
    const selectedObject = event.selected[0];
    if (selectedObject && selectedObject.type === "i-text") {
      toggleTextButtonsVisibility(true);
    }
  });
  canvas.on("selection:cleared", function () {
    toggleTextButtonsVisibility(false);
  });
}

canvasEvents(canvas);
canvasEvents(canvas2);

// Function to change font size from input field
function changeFontSizeFromInput(size, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fontSize", parseInt(size, 10));
    canvas.requestRenderAll();
  }
}

function fontSizeFromInput(selector, canvas) {
  // Event listener for the font size input field
  document
    .getElementById(selector)
    .addEventListener("change", function (event) {
      changeFontSizeFromInput(event.target.value, canvas);
    });
}

fontSizeFromInput("fontSizeInput", canvas);
fontSizeFromInput("fontSizeInput2", canvas2);

// Function to change text color from color picker
function changeFontColor(color, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fill", color);
    canvas.requestRenderAll();
  }
}

function changeTextColor(selector, canvas) {
  // Event listener for the color picker
  document.getElementById(selector).addEventListener("input", function (event) {
    changeFontColor(event.target.value, canvas);
    const activeObject = canvas.getActiveObject().fabricID;
    updateTextPreview(activeObject, canvas);
  });
}

changeTextColor("colorPicker", canvas);
changeTextColor("colorPicker2", canvas2);

// Function to change font family
function changeFontFamily(font, canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "i-text") {
    activeObject.set("fontFamily", font);
    canvas.requestRenderAll();
  }
}

function changeFontFamilyFun(selector, canvas) {
  // Event listeners for font family and font size select elements
  document
    .getElementById(selector)
    .addEventListener("change", function (event) {
      changeFontFamily(event.target.value, canvas);
    });
}

changeFontFamilyFun("fontFamilySelect", canvas);
changeFontFamilyFun("fontFamilySelect2", canvas2);

canvas.on("text:changed", function (event) {
  const activeObject = canvas.getActiveObject().fabricID;
  updateTextPreview(activeObject, canvas);
});

canvas2.on("text:changed", function (event) {
  const activeObject = canvas2.getActiveObject().fabricID;
  updateTextPreview(activeObject, canvas2);
});

function createTextPreview(activeObject, container) {
  const textPreviewContainer = document.createElement("div");
  const textContentDiv = document.createElement("p");
  textPreviewContainer.className = "text-preview-container";
  textPreviewContainer.id = `fabric_${activeObject.fabricID}`;
  textContentDiv.textContent = activeObject.text;
  textContentDiv.style.fontFamily = activeObject.fontFamily;
  textContentDiv.style.fontSize = activeObject.fontSize + "px";
  textContentDiv.style.color = activeObject.fill;
  textContentDiv.style.fontWeight = activeObject.fontWeight;
  textContentDiv.style.fontStyle = activeObject.fontStyle;
  const deleteButton = document.createElement("div");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash delete-icon" title="Trash" onclick="deleteTextPreview('${activeObject.fabricID}')"></i>`;
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "buttons-div";
  textPreviewContainer.appendChild(textContentDiv);
  buttonsDiv.appendChild(deleteButton);
  textPreviewContainer.appendChild(buttonsDiv);

  document.querySelector(container).append(textPreviewContainer);
}

function updateTextPreview(fabricID, canvas) {
  const fabricObject = canvas
    .getObjects()
    .find((obj) => obj.get("fabricID") === fabricID);

  if (fabricObject && fabricObject.type === "i-text") {
    const textPreview = document.querySelector(`#fabric_${fabricID} p`);
    console.log(textPreview);

    textPreview.textContent = fabricObject.text;
    // textPreview.style.fontFamily = fabricObject.fontFamily;
    // textPreview.style.fontSize = fabricObject.fontSize + 'px';
    textPreview.style.color = fabricObject.fill;
    textPreview.style.fontWeight = fabricObject.fontWeight;
    textPreview.style.fontStyle = fabricObject.fontStyle;
    // Update other styles as needed (e.g., fontWeight, fontStyle, etc.)
  }
}

function movingImages(container) {
  $(container).sortable({
    placeholder: "slide-placeholder",
    axis: "y",
    revert: 150,
    start: function (e, ui) {
      placeholderHeight = ui.item.outerHeight();
      ui.item.addClass("opacity-less");
      ui.placeholder.height(placeholderHeight + 15);
      $(
        '<div class="slide-placeholder-animator" data-height="' +
          placeholderHeight +
          '"></div>'
      ).insertAfter(ui.placeholder);
    },
    change: function (event, ui) {
      ui.placeholder
        .stop()
        .height(0)
        .animate(
          {
            height: ui.item.outerHeight() + 15,
          },
          300
        );

      placeholderAnimatorHeight = parseInt(
        $(".slide-placeholder-animator").attr("data-height")
      );

      $(".slide-placeholder-animator")
        .stop()
        .height(placeholderAnimatorHeight + 15)
        .animate(
          {
            height: 0,
          },
          300,
          function () {
            $(this).remove();
            placeholderHeight = ui.item.outerHeight();
            $(
              '<div class="slide-placeholder-animator" data-height="' +
                placeholderHeight +
                '"></div>'
            ).insertAfter(ui.placeholder);
          }
        );
    },
    stop: function (e, ui) {
      $(".slide-placeholder-animator").remove();
      ui.item.removeClass("opacity-less");
      const previewDivs = document.querySelectorAll(".image-icon-container");
      previewDivs.forEach((previewDiv, index) => {
        const fabricID = previewDiv.getAttribute("id"); // Assume the preview div's ID is set as the fabricID

        const fabricObject = canvas
          .getObjects()
          .find((obj) => obj.get("fabricID") === fabricID);
        const fabricObject2 = canvas2
          .getObjects()
          .find((obj) => obj.get("fabricID") === fabricID);

        if (fabricObject) {
          const newZIndex = fabricObject.zIndex - 1; // Set the new z-index based on the index of the preview div
          fabricObject.set("zIndex", newZIndex);
          canvas.moveTo(fabricObject, newZIndex);
          console.log(fabricObject);
        } else if (fabricObject2) {
          const newZIndex = fabricObject2.zIndex - 1; // Set the new z-index based on the index of the preview div
          fabricObject2.set("zIndex", newZIndex);
          canvas2.moveTo(fabricObject2, newZIndex);
          console.log(fabricObject);
        }
      });

      canvas.renderAll();
    },
  });
}

movingImages("#image-preview-container");
movingImages("#image-preview-container2");

$("#shirtSize").click(function (params) {
  $(this).hide();
  $(".buttons-container").hide();
  $("#shirtColor").hide();
  $("#edit-btn").show();
  $("#cart-btn").show();
  $(".shirt-size-menu").show();
});

$("#edit-btn").click(function (params) {
  $(this).hide();
  $(".buttons-container").show();
  $("#shirtColor").show();
  $("#shirtSize").show();
  $("#cart-btn").hide();
  $(".shirt-size-menu").hide();
  $(".select-shirt-color-div").hide();
});

$(".menu-form").submit(function (e) {
  e.preventDefault();
});

$("#shirtColor").click(function (params) {
  $(".select-shirt-color-div").css("display", "flex");
  $("#edit-btn").show();
  // $("#cart-btn").show();
  $("#shirtColor").hide();
  $("#shirtSize").hide();
  $(".labels-div").hide();
  $(".text-preview-container").hide();
  $("#text-preview").hide();
});

$(".color-div").click(function (params) {
  let id = $(this).attr("id");
  $("#shirt-image").attr("src", `./Shirt/Front/${id}.jpeg`);
  $("#shirt-image-back").attr("src", `./Shirt/Back/${id}.jpeg`);
  $(".color-div").removeClass("active");
  $(this).addClass("active");
  console.log(id);
  if (id == "White") {
    $("canvas").css("border-color", "black");
  } else {
    $("canvas").css("border-color", "white");
  }
});

$("#addTextBtn").click(function (params) {
  $(".select-shirt-color-div").hide();
  $(".labels-div").show();
  $(".text-preview-container").show();
});

$("#canvas2").parent().css({ top: "200px", left: "210px" });

// script.js

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const cartBtn = document.getElementById("cart-btn");

cartBtn.addEventListener("click", async function () {
  cartBtn.style.opacity = "0.7";
  const selectedImageSrc = document.getElementById("shirt-image").src;
  var shirtColor = $(".color-div.active").attr("id");

  // Collect the selected sizes and quantities
  var selectedSizes = {};
  $(".size-div").each(function () {
    var size = $(this).find("p").text().trim();
    var quantity = parseInt($(this).find(".size").val());

    // Only include sizes with a quantity greater than 0
    if (quantity > 0) {
      selectedSizes[size] = quantity;
    }
  });

  if (isObjectEmpty(selectedSizes)) {
    alert("Select Size!");
    return;
  } else {
    try {
      // Upload image and wait for completion
      await uploadImage();
      cartBtn.style.opacity = "1";

      const response = await fetch(
        "https://shirtmaker.onrender.com/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageSrc: selectedImageSrc,
            sizes: selectedSizes,
            color: shirtColor,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      console.log(session);

      // Redirect to the Stripe Checkout page
      window.location.href = session.url;
    } catch (error) {
      cartBtn.style.opacity = "1";
      console.error("Error processing checkout:", error);
      // Handle error, e.g., display an error message to the user
    }
  }
});

async function uploadImage() {
  var croppedDataUrl = canvas.toDataURL("image/png");
  try {
    // Send the cropped image data to backend and wait for completion
    const response = await fetch("https://shirtmaker.onrender.com/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: croppedDataUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

// Handle button clicks
$(".change-size").on("click", function () {
  var size = $(this).data("size");
  var increment = parseInt($(this).data("increment"));
  var sizeInput = $("#size" + size);

  var currentSize = parseInt(sizeInput.val());
  var newSize = currentSize + increment;

  // Ensure the size is not less than 0
  if (newSize < 0) {
    newSize = 0;
  }

  sizeInput.val(newSize);
});
