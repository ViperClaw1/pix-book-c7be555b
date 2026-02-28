import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentCanceled = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <XCircle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Payment Canceled</h1>
      <p className="text-muted-foreground mb-8">Your payment was not completed.</p>
      <Button onClick={() => navigate("/cart")} className="w-full max-w-xs h-12 rounded-xl text-base font-semibold">
        Back to Cart
      </Button>
    </div>
  );
};

export default PaymentCanceled;
