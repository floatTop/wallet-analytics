import { SingleBar } from "cli-progress";

export default function cliProgress(name: string) {
  return new SingleBar(
    {
      format:
        `${name} |` + "{bar}" + "| {percentage}% || {value}/{total} Chunks",
      barCompleteChar: "=",
      barIncompleteChar: "-",
      hideCursor: true,
      linewrap: false,
    }
  );
}
