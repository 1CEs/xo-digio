import z from "zod";

export const customizationSchema = z.object({
    boardRows: z.number().min(3, "Board must have at least 3 rows").max(10, "Board cannot have more than 10 rows"),
    boardCols: z.number().min(3, "Board must have at least 3 columns").max(10, "Board cannot have more than 10 columns"),
    aiDifficulty: z.enum(["easy", "medium", "hard"], {
        message: "Please select a valid AI difficulty"
    })
})