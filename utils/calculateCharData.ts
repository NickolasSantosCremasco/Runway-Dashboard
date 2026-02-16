import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export type ChartDataPoint = {
    month: string, 
    balance: number,
};

export const generateChartData = (
    cash: number, 
    expenses: number,
    passiveRevenue:number 
): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const netBurn = expenses - passiveRevenue;
    let currentBalance = cash;
    const now = new Date();
    //Ponto Inicial

    data.push({
        month: format(now, "MMM", {locale: ptBR}),
        balance: currentBalance
    });

    //Se não tem dívida líquida, projeta linha reta
    if(netBurn <= 0) {
        for(let i = 1; i <= 6; i++) {
            data.push({
                month: format(addMonths(now, i), "MMM", {locale: ptBR}),
                balance: currentBalance,
            });
        }
    }

    else {
        let monthIndex = 1;
        while (currentBalance > 0 && monthIndex <= 12) {
            currentBalance -= netBurn;

            const displayBalance = currentBalance < 0 ? 0 : currentBalance;

            data.push({
                month: format(addMonths(now, monthIndex), "MMM", {locale:ptBR}),
                balance: displayBalance,
            });

            if (currentBalance <= 0) break
            monthIndex++;
        }
    }
    return data
}