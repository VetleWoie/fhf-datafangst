

import { VesselFilter } from "components/Filters/VesselFilter"
import { Vessel } from "generated/openapi"
import { FC } from "react"

export const VesselFinder: FC = () => {


    return (
        <>
        <VesselFilter onChange={function (vessel?: Vessel[] | undefined): void {
                throw new Error("Function not implemented.")
            } } />
        
        </>
    )
}