import {Router} from "../App/Routing.Map.js";

export const TDG = async (router, dest, customModule = undefined) => {
    $.ajax({
        url: `./App/${router}.html`,
        data: {},
        success: async (html) => {

            /* Render */
            let render = html; 
            let module = (customModule == undefined) ? new (await Router.App()).default() : customModule;
            Object.entries(module).forEach( value => render = render.replace(`{${value[0]}}`, value[1]) );
            dest.innerHTML = render;

            /* Events */
            ["TDclick","TDkeyup"].forEach( customnEvent => {
                document.querySelectorAll(`[${customnEvent}]`).forEach( (el) => {
                    let method = el.getAttribute(customnEvent);
                    el.addEventListener(customnEvent.replace("TD", ""), function (e)  {
                        /* Re-render */
                        module[method]();
                        TDG(router, dest, module);
                    });
                });
            });

            /* Loops */
            document.querySelectorAll("[Foreach]").forEach( (el) => {
                let loopPhrase = el.getAttribute("Foreach");
                let loopSplice = loopPhrase.split(" ");

                if(loopSplice.length != 3) {
                    console.error(`Loop Synax Error: \`${loopPhrase}\``);
                    return;
                }

                /*
                * [0] - placeholder
                * [1] - 'of' keyword
                * [2] - array from module
                */
            
                let renderedLoop =  "";
                let template = el.outerHTML;

                let buffer = "";
                let fillBuffer = false;

                module[loopSplice[2]].forEach( (item) => {
                    let tmpTemplate = el.outerHTML;

                    if(typeof item != "object")  
                        tmpTemplate =tmpTemplate.replace( `{${loopSplice[0]}}`, item);

                    else {
                        for (let i = 0; i < template.length; i++) {

                            if(template[i] == "}") {

                                tmpTemplate = tmpTemplate.replace(
                                    `{${buffer}}`, 
                                    item[(`${buffer.replace(`${loopSplice[0]}.`,"")}`).replace(`${loopSplice[0]}.`,"")]
                                );
    
                                buffer = "";
                                fillBuffer = false;

                            }
    
                            if(fillBuffer) buffer += template[i];
                            if(template[i] == "{") fillBuffer = true;
    
                        }
                    }
                    
                    renderedLoop += `\r\n${tmpTemplate}`;
                });
                
                el.innerHTML = renderedLoop;
            });

            /* Logics */
            document.querySelectorAll("[IF]").forEach( (el) => {
                if(!module[el.getAttribute("IF")]) el.style.display = "none";
            });

            /* Closed Routes */
            document.querySelectorAll("[RouteTo]").forEach( (el) => {
                el.addEventListener("click", function (e) {
                    TDG(`${el.getAttribute("RouteTo")}/${el.getAttribute("RouteTo")}`, document.querySelector("output"));
                });
            });

            return render;

        }
    });

}