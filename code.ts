// import Blob from 'blob';
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
  let name, initialX, initialY, finalX, finalY, initialW, initialH, finalW, finalH;
  let animations: { classname: any; trigger: string | undefined; type: string; change: { initial: any[]; final: any[]; }; easing: string | undefined; duration: any; delay: number; }[] = []
  let selectedFrame = selected[0];

  if (selectedFrame.type === "FRAME") {
    // const triggerDetails = gettriggerDetails(selectedFrame)
    console.log('reaction: ', selectedFrame.reactions)
    console.log('selected name: ', selectedFrame.name)
    selectedFrame.reactions.forEach(async (reaction) => {
      console.log('reaction: ', reaction)
      if (reaction.action?.type === "NODE" && reaction.action.destinationId) {
        const destinationNode = figma.getNodeById(reaction.action.destinationId);
        for (const child of selectedFrame.children) {
          name = child.name;
          initialX = child.x
          initialY = child.y
          initialW = child.width
          initialH = child.height
          console.log('before : ', child.x, child.y)
          for (const child of destinationNode.children) {
            if (child.name === name) {
              console.log('name : ', name)
              console.log('destination name : ', child.name)
              console.log('after : ', child.x, child.y)
              finalX = child.x
              finalY = child.y
              finalW = child.width
              finalH = child.height
              if (child.type === "RECTANGLE" || child.type === "ELLIPSE" || child.type === "TEXT") {
                animations.push({
                  classname: name,
                  childtype: child.type,
                  trigger: setTrigger(reaction.trigger.type),
                  type: 'translate',
                  change: {
                    initial: {
                      pos: [initialX, initialY],
                      dimension: [initialW, initialH],

                    },
                    final: {
                      pos: [finalX, finalY],
                      dimension: [finalW, finalH],
                      fontsize: child.fontSize,
                      weight: child.fontWeight,
                      rotation: -1 * child.rotation,
                      bg: {
                        type: child.fills[0].type,
                        color: child.fills[0].type === 'SOLID' ?
                          `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`
                          :
                          await getImageUrl(child.fills[0].imageHash),
                        size: child.fills[0].scaleMode === 'FIT' ? 'contain' : 'cover',
                        repeat: 'no-repeat',
                        position: 'center'
                      },
                      radius: child.type === "ELLIPSE" ? '50%' : `${child.cornerRadius}px`,
                    }
                  },
                  easing: setEasing(reaction.action?.transition.easing),
                  duration: reaction.action?.transition?.duration,
                  delay: reaction.trigger?.type === 'AFTER_TIMEOUT' ? reaction.trigger.timeout : 0
                })
              } else if (child.type === "FRAME") {
                animations.push({
                  classname: name,
                  childtype: child.type,
                  trigger: setTrigger(reaction.trigger.type),
                  type: 'translate',
                  change: {
                    initial: {
                      pos: [initialX, initialY],
                      dimension: [initialW, initialH],

                    },
                    final: {
                      pos: [finalX, finalY],
                      dimension: [finalW, finalH],
                      fontsize: child.fontSize,
                      weight: child.fontWeight,
                      rotation: -1 * child.rotation,
                      bg: {
                        type: child.backgrounds[0].type,
                        color: child.backgrounds[0].type === 'SOLID' ?
                          `rgba(${child.backgrounds[0].color.r * 255},${child.backgrounds[0].color.g * 255},${child.backgrounds[0].color.b * 255},${child.backgrounds[0].opacity})`
                          :
                          await getImageUrl(child.backgrounds[0].imageHash),
                        size: child.backgrounds[0].scaleMode === 'FIT' ? 'contain' : 'cover',
                        repeat: 'no-repeat',
                        position: 'center'
                      },
                    }
                  },
                  easing: setEasing(reaction.action?.transition.easing),
                  duration: reaction.action?.transition?.duration,
                  delay: reaction.trigger?.type === 'AFTER_TIMEOUT' ? reaction.trigger.timeout : 0
                })
              } else if (child.type === "LINE") {
                animations.push({
                  classname: name,
                  childtype: child.type,
                  trigger: setTrigger(reaction.trigger.type),
                  type: 'translate',
                  change: {
                    initial: {
                      pos: [initialX, initialY],
                      dimension: [initialW, initialH],

                    },
                    final: {
                      pos: [finalX, finalY],
                      dimension: [finalW, child.strokeWeight],
                      fontsize: child.fontSize,
                      weight: child.fontWeight,
                      bg: {
                        type: 'SOLID',
                        color: `rgba(${child.strokes[0].color.r * 255},${child.strokes[0].color.g * 255},${child.strokes[0].color.b * 255},${child.strokes[0].opacity})`,
                        size: 'cover',
                        repeat: 'no-repeat',
                        position: 'center'
                      },
                      radius: `0px`,
                      rotation: -1 * child.rotation,
                    }
                  },
                  easing: setEasing(reaction.action?.transition.easing),
                  duration: reaction.action?.transition?.duration,
                  delay: reaction.trigger?.type === 'AFTER_TIMEOUT' ? reaction.trigger.timeout : 0
                })
              } else {
                animations.push({
                  classname: name,
                  childtype: child.type,
                  trigger: setTrigger(reaction.trigger.type),
                  type: 'translate',
                  change: {
                    initial: {
                      pos: [initialX, initialY],
                      dimension: [initialW, initialH],

                    },
                    final: {
                      pos: [finalX, finalY],
                      dimension: [finalW, finalH],
                      fontsize: child.fontSize,
                      weight: child.fontWeight,
                      rotation: -1 * child.rotation,
                    }
                  },
                  easing: setEasing(reaction.action?.transition.easing),
                  duration: reaction.action?.transition?.duration,
                  delay: reaction.trigger?.type === 'AFTER_TIMEOUT' ? reaction.trigger.timeout : 0
                })
              }
            }
          }
        }
        console.log('animations', animations)
      }
    })
    console.log(selectedFrame.type);
    let parentStyle = {
      id: selectedFrame.id,
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
        console.log(child.fills)
        styles = {
          // bg: child.fills[0].color,
          class: child.name,
          type: child.type,
          bg: {
            type: child.fills[0].type,
            color: child.fills[0].type === 'SOLID' ?
              `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`
              :
              await getImageUrl(child.fills[0].imageHash),
            size: child.fills[0].scaleMode === 'FIT' ? 'contain' : 'cover',
            repeat: 'no-repeat',
            position: 'center'
          },
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: `${child.cornerRadius}px`,
          rotation: -1 * child.rotation,
        };
      } else if (child.type === "TEXT") {
        styles = {
          class: child.name,
          // bg: child.fills[0].color,
          type: child.type,
          bg: {
            type: 'SOLID',
            color: 'transparent'
          },
          color: `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`,
          width: child.width,
          height: child.height,
          content: child.characters,
          posx: child.x,
          posy: child.y,
          stroke: child.strokes,
          radius: `${child.cornerRadius}px`,
          align: child.textAlignHorizontal,
          size: child.fontSize,
          font: child.fontName.family,
          weight: child.fontWeight,
          rotation: -1 * child.rotation,
        };
      } else if (child.type === "FRAME") {
        console.log(child.fills)
        styles = {
          class: child.name,
          // bg: child.backgrounds[0].color,
          type: child.type,
          bg: {
            type: child.backgrounds[0].type,
            color: child.backgrounds[0].type === 'SOLID' ?
              `rgba(${child.backgrounds[0].color.r * 255},${child.backgrounds[0].color.g * 255},${child.backgrounds[0].color.b * 255},${child.backgrounds[0].opacity})`
              :
              await getImageUrl(child.backgrounds[0].imageHash),
            size: child.backgrounds[0].scaleMode === 'FIT' ? 'contain' : 'cover',
            repeat: 'no-repeat',
            position: 'center'
          },
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: `${child.cornerRadius}px`,
          rotation: -1 * child.rotation,
        };
      } else if (child.type === "ELLIPSE") {
        console.log(child.fills)
        styles = {
          class: child.name,
          type: child.type,
          bg: {
            type: child.fills[0].type,
            color: child.fills[0].type === 'SOLID' ?
              `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`
              :
              await getImageUrl(child.fills[0].imageHash),
            size: child.fills[0].scaleMode === 'FIT' ? 'contain' : 'cover',
            repeat: 'no-repeat',
            position: 'center'
          },
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: '50%',
          rotation: -1 * child.rotation,
        };
      } else if (child.type === "LINE") {
        console.log(child.strokeStyleId)
        console.log(child.strokeWeight)
        console.log(child.strokes)
        console.log(child.rotation)
        styles = {
          class: child.name,
          type: child.type,
          bg: { type: 'SOLID', color: `rgba(${child.strokes[0].color.r * 255},${child.strokes[0].color.g * 255},${child.strokes[0].color.b * 255},${child.strokes[0].opacity})` },
          width: child.width,
          height: child.strokeWeight,
          posx: child.x,
          posy: child.y,
          rotation: -1 * child.rotation,
        };
      } else {
        styles = {
          class: child.name,
          // bg: child.fills[0].color,
          type: child.type,
          bg: {
            type: child.fills[0].type,
            color: child.fills[0].type === 'SOLID' ?
              `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`
              :
              await getImageUrl(child.fills[0].imageHash),
            size: child.fills[0].scaleMode === 'FIT' ? 'contain' : 'cover',
            repeat: 'no-repeat',
            position: 'center'
          },
          width: child.width,
          height: child.height,
          posx: child.x,
          posy: child.y,
          radius: `${child.cornerRadius}px`,
          rotation: -1 * child.rotation,
        };
      }
      console.log(styles);
      childElements.push(styles);
    }

    let childElementsHtml = "";
    let childElementsCss = '';
    let childElementsScripts = `const parentElement = document.querySelector('#id-parent');`;
    for (const animation of animations) {
      const result = applyAnimation(animation)
      childElementsCss += result.css;
      childElementsScripts += result.scripts;
    }

    for (const child of childElements) {
      childElementsHtml += `
      <div 
        class=${child.class} 
        id='id-${child.class}' 
        style="
          background-color: ${child.bg.type === 'SOLID' ? child.bg.color : 'transparent'}; 
          background-image: ${child.bg.type === 'IMAGE' ? `url('${child.bg.color}')` : ''};
          background-size: ${child.bg.size};
          background-repeat: ${child.bg.repeat};
          background-position: ${child.bg.position};
          border-radius: ${child.radius}; 
          color: ${child.type == 'TEXT' ? child.color : 'black'}; 
          width: ${child.width}px; height: ${child.height}px; 
          position: absolute; 
          top: ${child.posy}px; 
          left: ${child.posx}px; 
          transform: rotate(${child.rotation}deg); 
          font-size: ${child.size}px; 
          font-weight: ${child.weight}; 
          text-align: ${child.align}; 
          font-family: ${child.font}">
            ${(child.type == 'TEXT') ? child.content : ''}
      </div>`;
      // childElementsCss += `div {background-color: ${child.bg};}`;
    }

    let htmlCode = `<html><head><style>${childElementsCss}</style></head><body><div class='parent' id='id-parent' style="background-color: ${parentStyle.bg}; width: ${parentStyle.width}px; height: ${parentStyle.height}px; position: relative;">${childElementsHtml}</div><script>${childElementsScripts}</script></body></html>`;
    let cssCode = "body {background-color: yellow;}";

    console.log(htmlCode);
    console.log(cssCode);

    return;
  }

  figma.closePlugin();
  return;
}

function gettriggerDetails(frame) {
  let trigger = {}
  console.log('reaction: ', frame.reactions)
  if (frame.reactions.length > 0) {
    frame.reactions.forEach(async (reaction) => {
      trigger = {
        classname: name,
        childtype: frame.type,
        trigger: setTrigger(reaction.trigger.type),
        easing: setEasing(reaction.action?.transition.easing),
        duration: reaction.action?.transition?.duration,
        delay: reaction.trigger?.type === 'AFTER_TIMEOUT' ? reaction.trigger.timeout : 0
      }
    })
  }
  for (const child of frame.children) {
    console.log('reaction: ', child.reactions)
  }
}

function setBG(bg: { type: any; }) {
  switch (bg.type) {
    case 'SOLID': return `rgba(${child.fills[0].color.r * 255},${child.fills[0].color.g * 255},${child.fills[0].color.b * 255},${child.fills[0].opacity})`;
      break;
    case 'GRADIENT_LINEAR': return 'black';
      break;
  }
}

const getImageUrl = async (imageHash) => {
  const byteArray = await figma.getImageByHash(imageHash).getBytesAsync()
  console.log(byteArray);
  console.log('in function getImageUrl')
  const base64String = bytesToBase64(byteArray)
  console.log(base64String);
  const url = `data:image/png;base64,${base64String}`.replace(/(\r\n|\n|\r)/gm, '')
  console.log(url);
  return url;
}

function setTrigger(trigger: string) {
  switch (trigger) {
    case 'ON_CLICK': return 'click';
      break;
    case 'ON_HOVER': return 'mouseover';
      break;
    case 'ON_PRESS': return 'mousedown';
      break;
    case 'AFTER_TIMEOUT': return 'delay';
      break;
    case 'MOUSE_ENTER': return 'mouseenter';
      break;
    case 'MOUSE_LEAVE': return 'mouseleave';
      break;
    case 'MOUSE_DOWN': return 'mousedown';
      break;
    case 'MOUSE_UP': return 'mouseup';
      break;
  }
}

function setEasing(easing: Easing) {
  switch (easing.type) {
    case 'EASE_IN': return 'ease-in';
      break;
    case 'EASE_OUT': return 'ease-out';
      break;
    case 'EASE_IN_AND_OUT': return 'ease-in-out';
      break;
    case 'LINEAR': return 'linear';
      break;
    case 'CUSTOM_CUBIC_BEZIER': return `cubic-bezier(${easing.easingFunctionCubicBezier.x1}, ${easing.easingFunctionCubicBezier.y1}, ${easing.easingFunctionCubicBezier.x2}, ${easing.easingFunctionCubicBezier.y2})`
  }
}

function applyAnimation(animation) {
  const css = `@keyframes move${animation.classname} {
    from {
      transform: translateX(0px) translateY(0px);
      /* width: ${animation.change.initial.dimension[0]}px;
       height: ${animation.change.initial.dimension[1]}px; */
    }
    to {
      transform:  translateX(${animation.change.final.pos[0] - animation.change.initial.pos[0]}px) translateY(${animation.change.final.pos[1] - animation.change.initial.pos[1]}px) rotate(${animation.change.final.rotation === undefined ? `0` : animation.change.final.rotation}deg);
      width: ${animation.change.final.dimension[0]}px;
      height: ${animation.change.final.dimension[1]}px;
      font-size: ${animation.change.final.fontsize}px;
      font-weight: ${animation.change.final.weight}px;
      border-radius: ${animation.change.final.radius === undefined ? '0' : animation.change.final.radius}; 
      background-color: ${animation.childtype == 'TEXT' ? 'transparent' : animation.change.final.bg.type === 'SOLID' ? animation.change.final.bg.color : 'transparent'}; 
      background-image: ${animation.change.final.bg.type === 'IMAGE' ? `url('${animation.change.final.bg.color}')` : ''};
      background-size: ${animation.change.final.bg.size};
      background-repeat: ${animation.change.final.bg.repeat};
      background-position: ${animation.change.final.bg.position};
    }
  }
  .translate-${animation.classname} { animation: move${animation.classname} ${animation.duration}s ${animation.easing} ${animation.trigger === 'delay' ? '' : animation.delay + 's'} forwards;
}
  `

  const scripts = `
  ${animation.trigger === 'delay' ?
      `setTimeout(() => {
        const element = document.querySelector('#id-${animation.classname}');
      element.classList.add('translate-${animation.classname}');
      }, ${animation.delay * 1000});
      
      `
      :
      `// const parentElement = document.querySelector('#id-parent');
       parentElement.addEventListener('${animation.trigger}', () => {
          const element = document.querySelector('#id-${animation.classname}');
          element.classList.add('translate-${animation.classname}');
          //setTimeout(() => {
          // element.classList.remove('translate-${animation.classname}');
          //}, ${animation.duration});
       });`
    }
  `
  return { css: css, scripts: scripts }

}

const base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/",
];
function bytesToBase64(bytes: any) {
  let result = "",
    i,
    l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    // 1 octet yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += "==";
  }
  if (i === l) {
    // 2 octets yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0f) << 2];
    result += "=";
  }
  return result;
}

runPlugin();
