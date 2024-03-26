import React from "react";
import {Avatar} from "@nextui-org/react";

interface UserMessageProps {
    content: string;
}

const UserMessage: React.FC<UserMessageProps>  = ({ content }) => {
    return (
        <div className="flex gap-3">
            <div className="relative flex-none">
                <Avatar src="https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png" />
            </div>
            <div className="flex w-full flex-col gap-4 overflow-auto">
                <div className="relative w-full rounded-medium px-4 py-3 bg-content3 text-content3-foreground">
                    <div className="pr-20 text-small">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserMessage;
