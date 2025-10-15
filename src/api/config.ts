const fetchConfig = async (): Promise<string> => {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();

    return data.clerkPublishableKey
  } catch (error) {
    return '';
  }
}

export {
  fetchConfig
}
