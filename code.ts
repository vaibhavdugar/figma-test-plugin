// async function runPlugin() {
//   let selected = figma.currentPage.selection;

//   if (selected.length === 0) {
//     figma.closePlugin("No element selected");
//     return;
//   }
//   if (selected.length > 1) {
//     figma.closePlugin("Please select a single element");
//     return;
//   }
//   let selectedFrame = selected[0];
//   if (selectedFrame.type === "FRAME") {
//     console.log(selectedFrame.type);
//     let parentStyle = {
//       width: selectedFrame.width,
//       height: selectedFrame.height,
//       x: selectedFrame.x,
//       y: selectedFrame.y,
//       opacity: selectedFrame.opacity,
//       rotation: selectedFrame.rotation,
//       bgR: selectedFrame.backgrounds[0],
//       borderVal: selectedFrame.strokeWeight,
//       border: selectedFrame.strokeStyleId,
//       borderRadius: selectedFrame.cornerRadius,
//       boxShadow: selectedFrame.effects[0],
//       overflow: selectedFrame.clipsContent ? "hidden" : "visible",
//     };
//     console.log("parent", parentStyle);

//     const parent = selectedFrame.parent;
//     for (const child of selectedFrame.children) {
//       let styles = {};
//       if (child.type === "RECTANGLE") {
//         styles = {
//           type: child.type,
//           id: child.id,
//           name: child.name,
//           bgColor: child.fills[0].color,
//           width: child.width,
//           height: child.height,
//           x: child.x,
//           y: child.y,
//           opacity: child.opacity,
//           borderRadius: child.cornerRadius,
//           stroke: child.strokes[0],
//           strokeWidth: child.strokeWeight,
//           strokeAlign: child.strokeAlign,
//           strokeCap: child.strokeCap,
//           strokeJoin: child.strokeJoin,
//           strokeMiterLimit: child.strokeMiterLimit,
//         };
//       } else if (child.type === "TEXT") {
//         styles = {
//           type: child.type,
//           id: child.id,
//           name: child.name,
//           width: child.width,
//           height: child.height,
//           x: child.x,
//           y: child.y,
//           fontFamily: child.fontName.family,
//           fontStyle: child.fontName.style,
//           fontWeight: child.fontWeight,
//           fontSize: child.fontSize,
//           lineHeight: child.lineHeight,
//           letterSpacing: child.letterSpacing,
//           textDecoration: child.textDecoration,
//           textCase: child.textCase,
//           textAlignHorizontal: child.textAlignHorizontal,
//           textAlignVertical: child.textAlignVertical,
//           textAutoResize: child.textAutoResize,
//         };
//       } else if (child.type === "FRAME") {
//         styles = {
//           type: child.type,
//           id: child.id,
//           name: child.name,
//           width: child.width,
//           height: child.height,
//           x: child.x,
//           y: child.y,
//           opacity: child.opacity,
//           rotation: child.rotation,
//           bgColor: child.backgrounds[0].color,
//           borderVal: child.strokeWeight,
//           border: child.strokeStyleId,
//           borderRadius: child.cornerRadius,
//           boxShadow: child.effects[0],
//           overflow: child.clipsContent ? "hidden" : "visible",
//         };
//       } else {
//         styles = {
//           type: child.type,
//           id: child.id,
//           name: child.name,
//           width: child.width,
//           height: child.height,
//           x: child.x,
//           y: child.y,
//           bgColor: child.fills[0].color,
//         };
//       }
//       console.log(styles);
//     }

//     let htmlCode = `<html><head></head><body><div class='parent'></div></body></html>`;
//     let cssCode = "body {background-color: yellow;}";
//     return;
//   }

//   figma.closePlugin();
//   return;
// }

// runPlugin();

async function runPlugin() {
  let selected = figma.currentPage.selection;

  if (selected.length === 0) {
    figma.closePlugin("No element selected");
    return;
  }
  if (selected.length > 1) {
    figma.closePlugin("Please select a single element");
    return;
  }
  let selectedFrame = selected[0];
  if (selectedFrame.type === "FRAME") {
    console.log(selectedFrame.type);
    let parentStyle = {
      width: selectedFrame.width,
      height: selectedFrame.height,
      x: selectedFrame.x,
      y: selectedFrame.y,
      opacity: selectedFrame.opacity,
      rotation: selectedFrame.rotation,
      // bgR: selectedFrame.backgrounds[0],
      bg: `rgba(${selectedFrame.backgrounds[0].color.r * 255},${selectedFrame.backgrounds[0].color.g * 255
        },${selectedFrame.backgrounds[0].color.b * 255},${selectedFrame.backgrounds[0].opacity
        })`,
      borderVal: selectedFrame.strokeWeight,
      border: selectedFrame.strokeStyleId,
      borderRadius: selectedFrame.cornerRadius,
      boxShadow: selectedFrame.effects[0],
      overflow: selectedFrame.clipsContent ? "hidden" : "visible",
    };
    console.log("parent", parentStyle);

    const parent = selectedFrame.parent;
    let childElements = [];
    for (const child of selectedFrame.children) {
      let styles = {};
      if (child.type === "RECTANGLE") {
        styles = {
          // bg: child.fills[0].color,
          type: child.type,
          bg: `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`,
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: child.cornerRadius,
        };
      } else if (child.type === "TEXT") {
        styles = {
          // bg: child.fills[0].color,
          type: child.type,
          bg: `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`,
          width: child.width,
          height: child.height,
          content: child.characters,
          posx: child.x,
          posy: child.y,
          stroke: child.strokes,
          radius: child.cornerRadius,
          align: child.textAlignHorizontal,
          size: child.fontSize,
          font: child.fontName.family,
          weight: child.fontWeight,
        };
      } else if (child.type === "FRAME") {
        styles = {
          // bg: child.backgrounds[0].color,
          type: child.type,
          bg: `rgba(${child.backgrounds[0].color.r * 255},${child.backgrounds[0].color.g * 255},${child.backgrounds[0].color.b * 255},${child.backgrounds[0].opacity})`,
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: child.cornerRadius,
        };
      } else {
        styles = {
          // bg: child.fills[0].color,
          type: child.type,
          bg: `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`,
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: child.cornerRadius,
        };
      }
      console.log(styles);
      childElements.push(styles);
    }

    let childElementsHtml = "";
    let childElementsCss = "";
    for (const child of childElements) {
      childElementsHtml += `<div style="background-color: ${child.type == 'TEXT' ? 'transparent' : child.bg}; border-radius: ${child.radius}px; color: ${child.type == 'TEXT' ? child.bg : ''}; width: ${child.width}px; height: ${child.height}px; position: absolute; top: ${child.posy}px; left: ${child.posx}px; color: ${child.bg}; font-size: ${child.size}px; font-weight: ${child.weight}; text-align: ${child.align}; font-family: ${child.font}">${(child.type == 'TEXT') ? child.content : ''}</div>`;
      // childElementsCss += `div {background-color: ${child.bg};}`;
    }

    let htmlCode = `<html><head><style>${childElementsCss}</style></head><body><div class='parent' style="background-color: ${parentStyle.bg}; width: ${parentStyle.width}px; height: ${parentStyle.height}px; position: relative;">${childElementsHtml}</div></body></html>`;
    let cssCode = "body {background-color: yellow;}";

    console.log(htmlCode);
    console.log(cssCode);

    return;
  }

  figma.closePlugin();
  return;
}

runPlugin();
