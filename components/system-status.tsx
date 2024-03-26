import {useSelector, useDispatch} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import {CloseIcon} from "@/components/icons";
import {closeStatus} from "@/store/system-status-slice";
import {Divider} from "@nextui-org/react";

const SystemStatus = () => {
    const dispatch = useDispatch<AppDispatch>();
    const systemStatus = useSelector((state: RootState) => state.systemStatusReducer);

    if (systemStatus.SystemStatus.length == 0) {
        return <>{undefined}</>
    }

    const handleCloseStatus = (ID: string | undefined) => {
        if (ID) {
            dispatch(closeStatus(ID))
        }
    }

    return (
        <div className="fixed text-small w-full flex flex-col ease-in-out bottom-0 duration-250" style={{zIndex: "10"}}>
            {systemStatus.SystemStatus.map((item, index) => {
                return (
                    <div key={index} className="w-full">
                        <Divider />
                        <section key={item.ID}
                                 className={`flex flex-row text-center w-full items-center justify-between px-2 text-white bg-${item.Color}`}>
                            <div>
                                {item.Message}
                            </div>
                            <div className="cursor-pointer" onClick={() => handleCloseStatus(item.ID)}>
                                <CloseIcon/>
                            </div>
                        </section>
                    </div>
                )
            })}
        </div>
    )
}

export default SystemStatus;
