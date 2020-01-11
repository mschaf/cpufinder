function parseCpuBenchmark(html){
  let parser = new DOMParser()
  let doc = parser.parseFromString(html, "text/html")

  let cpuDescription = doc.querySelector(".desc").textContent
  matchedDescription = cpuDescription.match(/[\s]+(?<name>.+?)\s{2,}Class:  (?<class>.+) Socket: (?<socket>.+) Clockspeed: (?<clockSpeed>.+) Turbo Speed: (?<turboSpeed>.+) No of Cores: (?<cores>.+) Typical TDP: (?<tdp>.+)[\s\S]+Average CPU Mark[\s\S]+?(?<passmark>\d+)[\s\S]+ Single Thread Rating: (?<passmarkSingle>\d+)[\s\S]+\*Margin for error: (?<errorMargin>.+)/)

  console.log({status: 'success', ...matchedDescription.groups})
  return {status: 'success', ...matchedDescription.groups}
}

function checkResponse(response){
  if (response.status === 200) {
    return response;
  } else  if (response.status === 404) {
    throw new Error("CPU not found.");
  } else {
    throw new Error("Got " + response.status + "");
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let cpuQuery = request.cpu
    cpuQuery = cpuQuery.replace(/(?<!\s)(v\d)/, " $1") // add space before version
    cpuQuery += " @" // add  @ to signalize ending, without this you get "E5-2660 v4" for "E5-2660"

    fetch('https://www.cpubenchmark.net/cpu.php?cpu=' + encodeURIComponent(cpuQuery), { mode: 'no-cors'})
      .then(response => checkResponse(response))
      .then(response => response.text())
      .then(text => parseCpuBenchmark(text))
      .then(result => sendResponse(result))
      .catch(error => sendResponse({status: 'failed: ' + error.message}))
    return true
  }
);
