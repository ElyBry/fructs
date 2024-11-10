<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendOrder extends Mailable
{
    use Queueable, SerializesModels;

    public $orderArray;
    /**
     * Create a new message instance.
     */
    public function __construct($order)
    {
        $this->orderArray = $order;
    }

    public function build()
    {
        return $this->view('emails.orders.notification')
            ->subject('Новый заказ: ' . $this->orderArray->id)
            ->with([
                'orderId' => $this->orderArray->id,
                'total_price' => $this->orderArray->total_price,
                'address' => $this->orderArray->address,
                'number' => $this->orderArray->number,
                'how_connect' => $this->orderArray->how_connect,
            ]);
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Send Order',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
