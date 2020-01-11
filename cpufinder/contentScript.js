// fix this to
let titleRegex = /(?<prefix>.+ )(?<cpu>[ELXIelxi]([357][- ])?\d{3,5}[WL]?( ?[vV]\d)?)(?<postfix>[ @,]?.*)/

// create info box
let infoBox = document.createElement('div')
infoBox.classList.add("cpufinder--info-box");
infoBox.classList.add("-hidden");
infoBox.innerHTML = "Hallo"
document.body.appendChild(infoBox)

// get titles
let titles = document.querySelectorAll('.s-item__title, .it-ttl, .vi-title__main, .title, .mfe-title span')

Array.from(titles).forEach((title) => {
  let titleText = title.textContent;
  let matchedTitle = titleText.match(titleRegex)

  // if title contains cpu name replace with custom title
  if(matchedTitle){
    let cpuName =  matchedTitle.groups.cpu
    let cpuNameSpan = document.createElement('span')
    cpuNameSpan.classList.add("cpufinder--cpu-name")
    cpuNameSpan.innerHTML = cpuName
    title.innerHTML = ""

    title.appendChild(document.createTextNode(matchedTitle.groups.prefix))
    title.appendChild(cpuNameSpan)
    title.appendChild(document.createTextNode(matchedTitle.groups.postfix))
     // matchedTitle.groups.prefix + " <span class=\"cpufinder--cpu-name\">" + cpuName + "</span> " + matchedTitle.groups.postfix

    cpuNameSpan.addEventListener("mouseenter", (event) => {
      infoBox.classList.remove("-hidden");
      infoBox.style.left = (event.pageX + 10) + "px"
      infoBox.style.top = event.pageY + "px"
      infoBox.innerHTML = 'loading...'
      chrome.runtime.sendMessage({cpu: cpuName}, function(response) {
        console.log(response)
        if(response.status == 'success'){
          cpuInfoText = response.name + "<br>\n"
          cpuInfoText += "Clockspeed: " + response.clockSpeed + "<br>\n"
          cpuInfoText += "Turbo Speed: " + response.turboSpeed + "<br>\n"
          cpuInfoText += "Cores: " + response.cores + "<br>\n"
          cpuInfoText += "Passmark: " + response.passmark + "<br>\n"
          cpuInfoText += "Passmark (single): " + response.passmarkSingle + "<br>\n"
          cpuInfoText += "Error Margin: " + response.errorMargin + "<br>\n"
          cpuInfoText += "TDP: " + response.tdp + "<br>\n"
          cpuInfoText += "Socket: " + response.socket + "<br>\n"
          cpuInfoText += "Class: " + response.class + "<br>\n"

          infoBox.innerHTML = cpuInfoText
        }else {
          infoBox.innerHTML = response.status
        }

      });
    });

    cpuNameSpan.addEventListener("mouseleave", () => {
      infoBox.classList.add("-hidden");
    });
  }

})
