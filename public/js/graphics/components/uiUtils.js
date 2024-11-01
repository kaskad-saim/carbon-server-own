export function toggleElementVisibility(element, isVisible) {
  element.style.display = isVisible ? 'block' : 'none';
}

export function showNoDataMessage(elements, chart) {
  toggleElementVisibility(elements.noDataMessage, true);
  toggleElementVisibility(elements.chartCanvas, false);
  if (chart) {
    chart.clear();
    chart.destroy();
    return null;
  }
  return chart;
}

export function hideNoDataMessage(elements) {
  toggleElementVisibility(elements.noDataMessage, false);
  toggleElementVisibility(elements.chartCanvas, true);
}

export function showPreloader(elements) {
  elements.loadingWrapper.style.display = 'flex';
}

export function hidePreloader(elements) {
  elements.loadingWrapper.style.display = 'none';
}

export function updateTitle(elements, chartTitle) {
  elements.graphTitle.textContent = chartTitle;
}
