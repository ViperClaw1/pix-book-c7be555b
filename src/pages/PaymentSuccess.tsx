import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle className="w-16 h-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8">Your order has been placed.</p>
      <Button onClick={() => navigate("/")} className="w-full max-w-xs h-12 rounded-xl text-base font-semibold">
        Back to Home
      </Button>
    </div>
  );
};

export default PaymentSuccess;
