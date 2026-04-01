export class FetchError extends Error {
  status: number;

  constructor(response: Response) {
    super(response.statusText);
    this.name = "FetchError";
    this.status = response.status;
  }
}
