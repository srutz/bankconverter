import { cn } from "@/lib/utils";

export function VideoPlayer({
  src,
  containerClasses = "",
  ...props
}: { containerClasses?: string } & React.VideoHTMLAttributes<HTMLVideoElement>) {
  return (
        <div className={cn("m-1 rounded-lg flex flex-col overflow-hidden", containerClasses)}>
          <video src={src} {...props} />
        </div>
  )
}
