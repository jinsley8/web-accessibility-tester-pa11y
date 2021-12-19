const issuesOutput = document.querySelector('#issues');
const issuesCount = document.querySelector('#number');
const emptyUrl = '<div class="py-4 px-6 bg-red-100 border border-solid rounded-md border-red-200 text-base text-red-500" role="alert">Please add a valid URL</div>';
const warningMessage = '<div class="py-4 px-6 bg-green-100 border border-solid rounded-md border-green-200 text-lg text-green-500" role="alert">No issues found</div>';
const CsvMessage = '<div class="py-4 px-6 bg-red-100 border border-solid rounded-md border-red-200 text-lg text-red-500" role="alert">CSV not available</div>';

// Fetch a11y issues
const testAccessibility = async (e) => {
  e.preventDefault();

  const url = document.querySelector('#url').value;

  if(url === "") {
    issuesOutput.innerHTML = emptyUrl;
  } else {
    setLoading();

    const response = await fetch(`/api/test?url=${url}`);

    if(response.status !== 200) {
      setLoading(false);
      const { error } = await response.json();
      issuesOutput.innerHTML = `<div class="py-4 px-6 bg-red-100 border border-solid rounded-md border-red-200 text-lg text-red-500" role="alert">Incorrect URL - ${error}</div>`;
    } else {
      const { issues } = await response.json();
      addIssuesToDOM(issues);
      setLoading(false);
      document.getElementById("clearResults").classList.remove("hideButton");
      document.getElementById("csvBtn").classList.remove("hideButton");
    }
  }
}

// Download CSV
const csvIssues = async (e) => {
  e.preventDefault();
  const url = document.querySelector('#url').value;

  if (url === '') {
    issuesOutput.innerHTML = emptyUrl;
  }
  else {
    const response = await fetch(`/api/test?url=${url}`);

    if (response.status !== 200) {
      setLoading(false);
      alert(csvMessage);
    } else if(issues.length === 0){
      alert(CsvMessage);
    } else {
      const { issues } = await response.json();

      const csv = issues.map(issue => {
        return `${issue.code},${issue.message},${issue.context}`;
      }).join('\n');

      const csvBlob = new Blob([csv], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');

      link.href = csvUrl;
      link.download = 'a11y_issues_list_'+url.substring(12)+'.csv'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

//C lear results
const clearResults = (e) => {
  e.preventDefault();
  issuesOutput.innerHTML = '';
  issuesCount.innerHTML = '';
  document.querySelector('#url').value = '';
  document.getElementById("clearResults").classList.add("hideButton");
  document.getElementById("csvBtn").classList.add("hideButton");
}

// Add issues to DOM
const addIssuesToDOM = (issues) => {

  issuesOutput.innerHTML = '';
  issuesCount.innerHTML = '';

  if(issues.length === 0) {
    issuesOutput.innerHTML = warningMessage;
  } else {
    issuesCount.innerHTML = `
      <div class="mb-8 py-4 px-6 bg-red-100 border border-solid rounded-md border-red-200 text-lg text-red-500" role="alert">${issues.length} issues found!</div>
    `;

    issues.forEach((issue) => {
      const output = `
        <div class="bg-white flex flex-col rounded-lg border-solid border border-gray-200 shadow px-8 py-8 mb-8">
            <h2 class="font-sans text-lg leading-6 font-medium text-gray-900 mb-8">${issue.message}</h2>

            <p class="bg-slate-100 rounded-md px-3 py-3 mb-4">
              ${escapeHTML(issue.context)}
            </p>

            <p class="flex text-light pt-3">
              <span class="mr-3 px-2 inline-flex items-center text-ss leading-4 font-semibold rounded-full bg-red-100 text-red-800">
                ${issue.type}
              </span>
              ${issue.code}
            </p>
        </div>
      `

      issuesOutput.innerHTML += output;
    })
  }
}

// Set loading state
const setLoading = (isLoading = true) => {
  const loader = document.querySelector('.loader');

  if(isLoading) {
    loader.style.display = 'block';
    issuesOutput.innerHTML = '';
  } else {
    loader.style.display = 'none';
  }
}

// Escape HTML
function escapeHTML(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

document.querySelector('#form').addEventListener('submit', testAccessibility);
document.querySelector('#clearResults').addEventListener('click', clearResults);
document.querySelector('#csvBtn').addEventListener('click', csvIssues);